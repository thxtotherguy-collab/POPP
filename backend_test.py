import requests
import sys
import json
from datetime import datetime

class PoppPumpsAPITester:
    def __init__(self, base_url="https://popp-pumps-shop.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, passed, details=""):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_result(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_result(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_seed_data(self):
        """Test seed data endpoint"""
        return self.run_test("Seed Data", "POST", "seed", 200)

    def test_get_categories(self):
        """Test get categories"""
        success, data = self.run_test("Get Categories", "GET", "categories", 200)
        if success and isinstance(data, list) and len(data) > 0:
            self.log_result("Categories Data Validation", True, f"Found {len(data)} categories")
            return True, data
        elif success:
            self.log_result("Categories Data Validation", False, "No categories returned")
            return False, data
        return success, data

    def test_get_brands(self):
        """Test get brands"""
        success, data = self.run_test("Get Brands", "GET", "brands", 200)
        if success and isinstance(data, list) and len(data) > 0:
            self.log_result("Brands Data Validation", True, f"Found {len(data)} brands")
            return True, data
        elif success:
            self.log_result("Brands Data Validation", False, "No brands returned")
            return False, data
        return success, data

    def test_get_products(self):
        """Test get products without filters"""
        success, data = self.run_test("Get Products", "GET", "products", 200)
        if success and isinstance(data, list) and len(data) > 0:
            self.log_result("Products Data Validation", True, f"Found {len(data)} products")
            return True, data
        elif success:
            self.log_result("Products Data Validation", False, "No products returned")
            return False, data
        return success, data

    def test_get_featured_products(self):
        """Test get featured products"""
        success, data = self.run_test("Get Featured Products", "GET", "products?featured=true&limit=8", 200)
        if success and isinstance(data, list):
            featured_count = len(data)
            self.log_result("Featured Products Data Validation", True, f"Found {featured_count} featured products")
            return True, data
        return success, data

    def test_products_with_filters(self):
        """Test products with various filters"""
        # Test category filter
        success1, _ = self.run_test("Products Category Filter", "GET", "products?category=booster-pumps", 200)
        
        # Test brand filter
        success2, _ = self.run_test("Products Brand Filter", "GET", "products?brand=DAB", 200)
        
        # Test search filter
        success3, _ = self.run_test("Products Search Filter", "GET", "products?search=pump", 200)
        
        # Test sort options
        success4, _ = self.run_test("Products Sort Price Asc", "GET", "products?sort=price_asc", 200)
        success5, _ = self.run_test("Products Sort Price Desc", "GET", "products?sort=price_desc", 200)
        success6, _ = self.run_test("Products Sort Name Asc", "GET", "products?sort=name_asc", 200)
        success7, _ = self.run_test("Products Sort Name Desc", "GET", "products?sort=name_desc", 200)
        
        return all([success1, success2, success3, success4, success5, success6, success7])

    def test_get_single_product(self, product_id=None):
        """Test get single product"""
        if not product_id:
            # Get a product ID first
            success, products = self.test_get_products()
            if success and products:
                product_id = products[0]['id']
            else:
                self.log_result("Get Single Product", False, "No products available to test with")
                return False, {}
        
        success, data = self.run_test("Get Single Product", "GET", f"products/{product_id}", 200)
        if success and data.get('id') == product_id:
            self.log_result("Single Product Data Validation", True, f"Product ID matches: {product_id}")
            return True, data
        elif success:
            self.log_result("Single Product Data Validation", False, f"Product ID mismatch")
            return False, data
        return success, data

    def test_get_related_products(self, product_id=None):
        """Test get related products"""
        if not product_id:
            # Get a product ID first
            success, products = self.test_get_products()
            if success and products:
                product_id = products[0]['id']
            else:
                self.log_result("Get Related Products", False, "No products available to test with")
                return False, {}
        
        success, data = self.run_test("Get Related Products", "GET", f"products/{product_id}/related", 200)
        if success and isinstance(data, list):
            self.log_result("Related Products Data Validation", True, f"Found {len(data)} related products")
            return True, data
        return success, data

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        test_user_data = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@popptest.com",
            "password": "TestPass123!",
            "phone": "+27123456789"
        }
        
        success, data = self.run_test("User Registration", "POST", "auth/register", 200, test_user_data)
        if success and data.get('token') and data.get('user'):
            self.token = data['token']  # Store token for subsequent tests
            self.log_result("Registration Data Validation", True, f"User registered: {data['user']['email']}")
            return True, data
        elif success:
            self.log_result("Registration Data Validation", False, "Missing token or user in response")
            return False, data
        return success, data

    def test_user_login(self):
        """Test user login with registered user"""
        if not self.token:
            self.log_result("User Login", False, "No user registered to test login with")
            return False, {}
            
        # First register a user for login test
        timestamp = datetime.now().strftime("%H%M%S") + "login"
        test_user_data = {
            "name": f"Login Test User {timestamp}",
            "email": f"logintest{timestamp}@popptest.com",
            "password": "LoginTest123!",
            "phone": "+27123456790"
        }
        
        # Register user
        reg_success, _ = self.run_test("Pre-Login Registration", "POST", "auth/register", 200, test_user_data)
        if not reg_success:
            return False, {}
        
        # Now test login
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
        
        success, data = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        if success and data.get('token') and data.get('user'):
            self.log_result("Login Data Validation", True, f"User logged in: {data['user']['email']}")
            return True, data
        elif success:
            self.log_result("Login Data Validation", False, "Missing token or user in response")
            return False, data
        return success, data

    def test_auth_me(self):
        """Test get current user"""
        if not self.token:
            self.log_result("Get Current User", False, "No token available for auth test")
            return False, {}
        
        success, data = self.run_test("Get Current User", "GET", "auth/me", 200, headers={'Authorization': f'Bearer {self.token}'})
        if success and data.get('email'):
            self.log_result("Auth Me Data Validation", True, f"Current user: {data['email']}")
            return True, data
        elif success:
            self.log_result("Auth Me Data Validation", False, "Missing user data in response")
            return False, data
        return success, data

    def test_quote_creation(self):
        """Test quote creation"""
        quote_data = {
            "name": "Test Customer",
            "email": "customer@test.com",
            "phone": "+27123456789",
            "company": "Test Company",
            "message": "Test quote request",
            "items": [
                {"id": "test-product-1", "name": "Test Pump", "qty": 2, "price": 1000},
                {"id": "test-product-2", "name": "Test Tank", "qty": 1, "price": 5000}
            ]
        }
        
        success, data = self.run_test("Create Quote", "POST", "quotes", 200, quote_data)
        if success and data.get('id') and data.get('status') == 'pending':
            self.log_result("Quote Creation Data Validation", True, f"Quote created with ID: {data['id']}")
            return True, data
        elif success:
            self.log_result("Quote Creation Data Validation", False, "Missing quote ID or incorrect status")
            return False, data
        return success, data

    def test_consultation_creation(self):
        """Test consultation creation endpoint"""
        consultation_data = {
            "full_name": "Test Engineer",
            "company": "Test Engineering Co",
            "phone": "+27123456789",
            "email": "engineer@test.com",
            "location": "Cape Town, Western Cape",
            "application_type": "commercial",
            "installation_type": "new",
            "flow_rate": "120 L/min",
            "pressure_head": "45m",
            "power_supply": "three_phase",
            "water_source": "borehole",
            "pipe_size": "2 inch",
            "budget": "R50,000 - R100,000",
            "timeline": "short",
            "description": "Need pump system for commercial building water supply from borehole. Building has 3 floors with 20 outlets total. Distance from borehole to building is approximately 150m with 15m elevation difference."
        }
        
        success, data = self.run_test("Create Consultation", "POST", "consultations", 200, consultation_data)
        if success and data.get('id') and data.get('status') == 'pending':
            self.log_result("Consultation Creation Data Validation", True, f"Consultation created with ID: {data['id']}")
            return True, data
        elif success:
            self.log_result("Consultation Creation Data Validation", False, "Missing consultation ID or incorrect status")
            return False, data
        return success, data

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"POPP PUMPS API TEST SUMMARY")
        print(f"="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "No tests run")
        
        if self.tests_run - self.tests_passed > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting POPP Pumps API Tests...")
    print("Testing against: https://popp-pumps-shop.preview.emergentagent.com")
    
    tester = PoppPumpsAPITester()
    
    # Run all tests
    tester.test_health_check()
    tester.test_seed_data()
    tester.test_get_categories()
    tester.test_get_brands()
    tester.test_get_products()
    tester.test_get_featured_products()
    tester.test_products_with_filters()
    tester.test_get_single_product()
    tester.test_get_related_products()
    tester.test_user_registration()
    tester.test_user_login()
    tester.test_auth_me()
    tester.test_quote_creation()
    tester.test_consultation_creation()
    
    # Print summary and return result
    all_passed = tester.print_summary()
    
    # Save results to file for reference
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
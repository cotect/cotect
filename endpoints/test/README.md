# Stress test of API endpoints
Stress testing scripts using the k6 framework: https://k6.io/  
Install instruction for k6: https://k6.io/docs/getting-started/installation 

To run the test with 10 virtual users sending a total of 50 requests execute:
```
 k6 run -u 10 -i 50 ./stress_test_report_endpoint.js
```
#include<bits/stdc++.h>
using namespace std;

vector<int> two_sum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }

        // Otherwise, store the number and its index
        seen[nums[i]] = i;
    }

    return {};
}

int main() {
    int t;  // Number of test cases
    cin >> t;

    while (t--) {
        int n, target;
        cin >> n;
        
        vector<int> nums(n);
        for (int i = 0; i < n; ++i) {
            cin >> nums[i];
        }
        
        cin >> target;

        vector<int> result = two_sum(nums, target);
        if(result.empty()) {
            cout<<-1<<endl;
            continue;
        }
        cout<<result[0]<<" "<<result[1]<<endl;
    }

    return 0;
}
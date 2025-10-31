import datetime
import pytest
from data_consumption import ValidateData

consumption_data_1 = {'household_id': '0000000001', 'meter_point_id': 1, 'consumption': [{'consumption_type': 'Import', 'consumption_value': 1.8, 'consumption_date': '2025-10-30'}]}

class TestConsumptionData:

    def test_valid_household_id(self):
        self.data = ValidateData({ 'household_id': 'abcdabcdab' }) # 10 characters
        assert self.data.check_household_id() == True

    def test_invalid_household_id(self):
        self.data = ValidateData({ 'household_id': 'aabbaabbaac' }) # 11 character
        assert self.data.check_household_id() == False

    def test_valid_meter_point_id(self):
        self.data = ValidateData({ 'meter_point_id': 1 })
        assert self.data.check_meter_point_id() == True

    def test_invalid_meter_point_id(self):
        self.data = ValidateData({ 'meter_point_id': -1 })
        assert self.data.check_meter_point_id() == False

    def test_valid_consumption_type(self):
        self.data = ValidateData({ 'consumption': [{ 'consumption_type': 'Import' }] })
        assert self.data.check_consumption_type() == True

    def test_invalid_consumption_type(self):
        self.data = ValidateData({ 'consumption': [{ 'consumption_type': 'port' }] })
        assert self.data.check_consumption_type() == False

    def test_valid_consumption_value(self):
        self.data = ValidateData({ 'consumption': [{ 'consumption_value': 5.6868 }] })
        assert self.data.check_consumption_value() == True

    def test_invalid_consumption_value(self):
        self.data = ValidateData({ 'consumption': [{ 'consumption_value': 'error' }] })
        assert self.data.check_consumption_value() == False


    def test_valid_consumption_date(self):
        self.data = ValidateData({ 'consumption': [{ 'consumption_date': '2025-10-30' }] }) # yyyy-mm-dd
        assert self.data.check_consumption_date() == True

    def test_invalid_consumption_date(self):
        self.data = ValidateData({ 'consumption': [{ 'consumption_date': '30-10-2025' }] }) # dd-mm-yyyy - incorrect
        assert self.data.check_consumption_date() == False

# pytest -q test.py
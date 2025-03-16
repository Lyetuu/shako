// File: screens/GroupSavings/RequestWithdrawalScreen.js (update continued)
        <RadioButton.Group
          onValueChange={(value) => setFieldValue('bankAccountId', value)}
          value={values.bankAccountId}
        >
          {bankAccounts.map(account => (
            <View key={account.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton value={account.id} />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>
                  {account.nickname || account.bankName} 
                  {account.isDefault && ' (Default)'}
                </Text>
                <Text style={{ color: '#666', fontSize: 14 }}>
                  {account.accountType === 'CHECKING' ? 'Checking' : 'Savings'} •••• {account.last4}
                </Text>
              </View>
            </View>
          ))}
        </RadioButton.Group>
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('BankingDetails')}
          style={{ marginTop: 8 }}
          icon="plus"
        >
          Add Bank Account
        </Button>
        
        {touched.bankAccountId && errors.bankAccountId && (
          <HelperText type="error">{errors.bankAccountId}</HelperText>
        )}
      </Card.Content>
    </Card>
  </>
) : (
  <Card style={{ marginTop: 16, marginBottom: 16 }}>
    <Card.Content>
      <Text style={{ textAlign: 'center', marginBottom: 8 }}>
        You need to add a bank account to receive withdrawals
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('BankingDetails')}
        icon="bank"
      >
        Add Bank Account
      </Button>
    </Card.Content>
  </Card>
)}

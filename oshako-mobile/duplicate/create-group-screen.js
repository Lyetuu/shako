// File: screens/GroupSavings/CreateGroupScreen.js (continued)
        if (values.targetDate) {
          groupData.settings.targetDate = values.targetDate;
        }
      }
      
      if (values.hasMinimum) {
        groupData.settings.minimumContribution = parseFloat(values.minimumContribution);
      }
      
      const newGroup = await createSavingsGroup(groupData);
      
      Alert.alert(
        'Group Created',
        `"${values.name}" has been created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('GroupDetails', { 
              groupId: newGroup._id,
              groupName: newGroup.name
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', error.message || 'Failed to create savings group');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create a Savings Group</Text>
        
        <Formik
          initialValues={{
            name: '',
            description: '',
            hasGoal: false,
            goalAmount: '',
            targetDate: null,
            contributionFrequency: 'MONTHLY',
            hasMinimum: false,
            minimumContribution: '',
            isPublic: false,
            withdrawalPolicy: 'ADMIN_APPROVAL',
          }}
          validationSchema={CreateGroupSchema}
          onSubmit={handleCreateGroup}
        >
          {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  <Divider style={styles.divider} />
                  
                  <TextInput
                    label="Group Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    mode="outlined"
                    style={styles.input}
                    error={touched.name && errors.name}
                  />
                  {touched.name && errors.name && (
                    <HelperText type="error">{errors.name}</HelperText>
                  )}
                  
                  <TextInput
                    label="Description"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                    error={touched.description && errors.description}
                  />
                  {touched.description && errors.description && (
                    <HelperText type="error">{errors.description}</HelperText>
                  )}
                  
                  <View style={styles.switchContainer}>
                    <Text>Public Group</Text>
                    <Switch
                      value={values.isPublic}
                      onValueChange={(value) => setFieldValue('isPublic', value)}
                    />
                  </View>
                  <Text style={styles.helperText}>
                    {values.isPublic 
                      ? 'Anyone can find and request to join this group'
                      : 'Only people with invitation link can join this group'}
                  </Text>
                </Card.Content>
              </Card>
              
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Savings Goal</Text>
                  <Divider style={styles.divider} />
                  
                  <View style={styles.switchContainer}>
                    <Text>Set a Savings Goal</Text>
                    <Switch
                      value={values.hasGoal}
                      onValueChange={(value) => setFieldValue('hasGoal', value)}
                    />
                  </View>
                  
                  {values.hasGoal && (
                    <>
                      <TextInput
                        label="Goal Amount"
                        value={values.goalAmount}
                        onChangeText={handleChange('goalAmount')}
                        onBlur={handleBlur('goalAmount')}
                        keyboardType="numeric"
                        mode="outlined"
                        left={<TextInput.Affix text="$" />}
                        style={styles.input}
                        error={touched.goalAmount && errors.goalAmount}
                      />
                      {touched.goalAmount && errors.goalAmount && (
                        <HelperText type="error">{errors.goalAmount}</HelperText>
                      )}
                      
                      <TextInput
                        label="Target Date (Optional)"
                        value={values.targetDate}
                        onChangeText={handleChange('targetDate')}
                        onBlur={handleBlur('targetDate')}
                        mode="outlined"
                        placeholder="MM/DD/YYYY"
                        style={styles.input}
                        error={touched.targetDate && errors.targetDate}
                      />
                      {touched.targetDate && errors.targetDate && (
                        <HelperText type="error">{errors.targetDate}</HelperText>
                      )}
                    </>
                  )}
                </Card.Content>
              </Card>
              
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Contribution Settings</Text>
                  <Divider style={styles.divider} />
                  
                  <Text style={styles.label}>Contribution Frequency</Text>
                  <View style={styles.chipsContainer}>
                    {CONTRIBUTION_FREQUENCIES.map((frequency) => (
                      <Chip
                        key={frequency.value}
                        selected={values.contributionFrequency === frequency.value}
                        onPress={() => setFieldValue('contributionFrequency', frequency.value)}
                        style={styles.chip}
                        selectedColor="#6200ee"
                      >
                        {frequency.label}
                      </Chip>
                    ))}
                  </View>
                  
                  <View style={styles.switchContainer}>
                    <Text>Set Minimum Contribution</Text>
                    <Switch
                      value={values.hasMinimum}
                      onValueChange={(value) => setFieldValue('hasMinimum', value)}
                    />
                  </View>
                  
                  {values.hasMinimum && (
                    <>
                      <TextInput
                        label="Minimum Contribution Amount"
                        value={values.minimumContribution}
                        onChangeText={handleChange('minimumContribution')}
                        onBlur={handleBlur('minimumContribution')}
                        keyboardType="numeric"
                        mode="outlined"
                        left={<TextInput.Affix text="$" />}
                        style={styles.input}
                        error={touched.minimumContribution && errors.minimumContribution}
                      />
                      {touched.minimumContribution && errors.minimumContribution && (
                        <HelperText type="error">{errors.minimumContribution}</HelperText>
                      )}
                    </>
                  )}
                </Card.Content>
              </Card>
              
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Withdrawal Policy</Text>
                  <Divider style={styles.divider} />
                  
                  <RadioButton.Group
                    onValueChange={value => setFieldValue('withdrawalPolicy', value)}
                    value={values.withdrawalPolicy}
                  >
                    <TouchableRipple
                      onPress={() => setFieldValue('withdrawalPolicy', 'ADMIN_APPROVAL')}
                    >
                      <View style={styles.radioOption}>
                        <RadioButton value="ADMIN_APPROVAL" />
                        <View style={styles.radioTextContainer}>
                          <Text style={styles.radioLabel}>Admin Approval Required</Text>
                          <Text style={styles.radioDescription}>
                            All withdrawal requests must be approved by a group admin
                          </Text>
                        </View>
                      </View>
                    </TouchableRipple>
                    
                    <TouchableRipple
                      onPress={() => setFieldValue('withdrawalPolicy', 'ANYTIME')}
                    >
                      <View style={styles.radioOption}>
                        <RadioButton value="ANYTIME" />
                        <View style={styles.radioTextContainer}>
                          <Text style={styles.radioLabel}>Withdraw Anytime</Text>
                          <Text style={styles.radioDescription}>
                            Members can withdraw their contributions at any time
                          </Text>
                        </View>
                      </View>
                    </TouchableRipple>
                    
                    <TouchableRipple
                      onPress={() => setFieldValue('withdrawalPolicy', 'GOAL_ONLY')}
                    >
                      <View style={styles.radioOption}>
                        <RadioButton value="GOAL_ONLY" />
                        <View style={styles.radioTextContainer}>
                          <Text style={styles.radioLabel}>Goal Achievement Only</Text>
                          <Text style={styles.radioDescription}>
                            Withdrawals only allowed when the goal is reached
                          </Text>
                        </View>
                      </View>
                    </TouchableRipple>
                  </RadioButton.Group>
                </Card.Content>
              </Card>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={submitting}
                loading={submitting}
              >
                Create Savings Group
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={submitting}
              >
                Cancel
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
  },
  radioDescription: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
});

export default CreateGroupScreen;

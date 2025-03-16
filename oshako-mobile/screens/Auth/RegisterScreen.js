import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  ActivityIndicator,
  Checkbox
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { register } from '../../services/api/auth';
import { VALIDATION } from '../../config/constants';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
});

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      setRegisterError('');
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      
      Alert.alert(
        'Registration Successful',
        'You have successfully registered. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      setRegisterError(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#6200ee" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '', agreeTerms: false }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
              <View>
                <TextInput
                  label="Full Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  mode="outlined"
                  style={styles.input}
                  error={touched.name && errors.name}
                  disabled={isSubmitting}
                />
                {touched.name && errors.name && (
                  <HelperText type="error">{errors.name}</HelperText>
                )}

                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="outlined"
                  style={styles.input}
                  error={touched.email && errors.email}
                  disabled={isSubmitting}
                />
                {touched.email && errors.email && (
                  <HelperText type="error">{errors.email}</HelperText>
                )}

                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  mode="outlined"
                  style={styles.input}
                  error={touched.password && errors.password}
                  disabled={isSubmitting}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? 'eye-off' : 'eye'}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                />
                {touched.password && errors.password && (
                  <HelperText type="error">{errors.password}</HelperText>
                )}

                <TextInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry={!confirmPasswordVisible}
                  autoCapitalize="none"
                  mode="outlined"
                  style={styles.input}
                  error={touched.confirmPassword && errors.confirmPassword}
                  disabled={isSubmitting}
                  right={
                    <TextInput.Icon
                      icon={confirmPasswordVisible ? 'eye-off' : 'eye'}
                      onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    />
                  }
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <HelperText type="error">{errors.confirmPassword}</HelperText>
                )}

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={values.agreeTerms ? 'checked' : 'unchecked'}
                    onPress={() => setFieldValue('agreeTerms', !values.agreeTerms)}
                    disabled={isSubmitting}
                  />
                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      I agree to the 
                      <Text 
                        style={styles.termsLink}
                        onPress={() => {
                          // Navigate to terms and conditions page
                          // or show a modal
                        }}
                      >
                        {' '}Terms and Conditions
                      </Text>
                      {' '}and{' '}
                      <Text 
                        style={styles.termsLink}
                        onPress={() => {
                          // Navigate to privacy policy page
                          // or show a modal
                        }}
                      >
                        Privacy Policy
                      </Text>
                    </Text>
                  </View>
                </View>
                {touched.agreeTerms && errors.agreeTerms && (
                  <HelperText type="error">{errors.agreeTerms}</HelperText>
                )}

                {registerError ? (
                  <HelperText type="error" style={styles.errorText}>
                    {registerError}
                  </HelperText>
                ) : null}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Sign Up
                </Button>
              </View>
            )}
          </Formik>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            Log In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  input: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  termsContainer: {
    flex: 1,
    marginLeft: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    color: '#6200ee',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#666',
  },
  loginButton: {
    marginLeft: 8,
  },
});

export default RegisterScreen;

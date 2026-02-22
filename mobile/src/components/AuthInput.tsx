import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
  label: string;
}

const AuthInput = forwardRef<TextInput, AuthInputProps>(
  ({ label, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          style={[styles.input, props.multiline && styles.multiline, style]}
          placeholderTextColor="#bbb"
          {...props}
        />
      </View>
    );
  },
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F7FF',
    borderWidth: 1.5,
    borderColor: '#E8E6FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A2E',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});

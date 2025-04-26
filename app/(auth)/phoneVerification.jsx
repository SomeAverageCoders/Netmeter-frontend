import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import { useSignupData } from "../../context/UserSignupDataContext";
import { UserContext } from "../../context/UserContext";

const PhoneVerification = () => {
  const { phone } = useLocalSearchParams();
  const router = useRouter();
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const recaptchaVerifier = useRef(null);
  const createNewUser = useMutation(api.Users.CreateNewUser);
  const { signupData, setSignupData } = useSignupData();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (!signupData) {
      console.warn("No signup data available");
      setMessage(
        "Warning: Missing signup data. This may cause issues with registration."
      );
    }
  }, []);

  const sendVerificationCode = async () => {
    try {
      setIsLoading(true);
      setMessage("Sending verification code...");
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phone,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setIsCodeSent(true);
      setMessage("Verification code has been sent to your phone");
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmVerificationCode = async () => {
    try {
      setIsLoading(true);
      setMessage("Verifying code...");
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential);

      setMessage("Phone number verified successfully!");
      if (
        !signupData ||
        !signupData.name ||
        !signupData.phone ||
        !signupData.email ||
        !signupData.passwordHash
      ) {
        console.error("Signup data is incomplete:", signupData);
        setMessage("Error: Missing signup data. Please try registering again.");
        setIsLoading(false);
        return;
      }
      const convexUser = await createNewUser({
        name: signupData.name,
        phone: signupData.phone,
        email: signupData.email,
        passwordHash: signupData.passwordHash,
      });
      setUser(convexUser);
      setSignupData(null);
      router.replace("/(auth)/success");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      router.push(`/(auth)/unsuccess?phone=${encodeURIComponent(phone)}`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center items-center p-5 bg-gray-100"
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={false}
      />
      <Text className="text-2xl font-bold mb-8 text-gray-800">
        Phone Verification
      </Text>
      {!isCodeSent ? (
        <>
          <Text className="text-base mb-10 text-gray-600 text-center">
            We'll send a verification code to your phone
          </Text>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={sendVerificationCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-bold">
                Send Verification Code
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text className="text-base mb-10 text-gray-500 text-center">
            Enter the 6-digit code sent to {phone}
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-md p-4 mb-4 w-full"
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Verification code"
            autoFocus
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            editable={!isLoading}
            maxLength={6}
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={confirmVerificationCode}
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-bold">
                Verify Code
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {message ? (
        <Text className="mt-5 text-gray-600 text-center">{message}</Text>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4285F4",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#A4C2F4",
  },
});

export default PhoneVerification;
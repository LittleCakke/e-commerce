import {
    Image,
    Text,
    View
} from "react-native";
import AuthButton from "@/components/AuthButton";

export default function AuthScreen()
{
    return (
        <View
            className="flex-1 justify-center items-center bg-white gap-4">
            <Image
                source={require("@/assets/images/auth-image.png")}
                className="size-96"
                resizeMode="contain"
            />

            <View
                className="gap-4 w-4/5">
                {/* Google Sign in Button */}
                <AuthButton
                    strategy="oauth_google"
                    source={require("@/assets/images/google.png")}
                />
                <AuthButton
                    strategy="oauth_apple"
                    source={require("@/assets/images/apple.png")}
                />
                <AuthButton
                    strategy="oauth_github"
                    source={require("@/assets/images/github.png")}
                />
            </View>

            <Text
                className="text-center text-gray-500 text-xs px-16">
                By signing up, you agree to our
                <Text className="text-blue-500">Terms</Text>
                {", "}
                <Text className="text-blue-500">Privacy Policy</Text>
                {", and "}
                <Text className="text-blue-500">Cookie Use</Text>
            </Text>
        </View>
    );
}
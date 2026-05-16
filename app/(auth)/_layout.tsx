import { router, Stack } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";

export default function AuthLayout()
{
    const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false });

    useEffect(() =>
    {
        if (isSignedIn)
            router.replace("/(tabs)");
    }, [isSignedIn]);

    return <Stack screenOptions={{headerShown: false}}/>
}
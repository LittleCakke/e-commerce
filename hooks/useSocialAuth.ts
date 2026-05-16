import { useState } from "react";
import { Alert } from "react-native";
import { useSSO } from "@clerk/expo";
import type { Strategy } from "@/type";

export default function useSocialAuth()
{
    let [ isLoading, setIsLoading ] = useState(false);
    let { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: Strategy) =>
    {
        setIsLoading(true);
        try
        {
            let { createdSessionId, setActive } = await startSSOFlow({ strategy });
            if (createdSessionId && setActive)
            {
                await setActive({ session: createdSessionId });
            }
        }
        catch (e: any)
        {
            console.error("Error in social auth: ", e.message);
            let provider = strategy.split("_")[1];
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        handleSocialAuth
    }
}
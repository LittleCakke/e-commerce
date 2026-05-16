import { SignIn } from "@clerk/react";

export default function LoginPage()
{
    return (
        <div
            className="h-screen flex items-center justify-center">
            <SignIn />
        </div>
    );
}
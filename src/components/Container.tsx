import { ReactNode } from "react";

export default function Container({children}:{children:ReactNode}){
    return (
        <div className="max-w-[1440px] mx-auto bg-white min-h-screen flex flex-col">{children}</div>
    )
}
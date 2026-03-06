import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

export const MainSection = () => {
    return (
        <div className="min-h-screen min-w-screen p-5 flex">
            <LeftSection />
            <RightSection />
        </div>
    );  
}
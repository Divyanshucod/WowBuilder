import { LeftBottomSection } from "./LeftBottomSection";
import { LeftTopSection } from "./LeftTopSection";

export const LeftSection = () => {
    return (
        <div className="min-h-full min-w-[70%]">
            <LeftTopSection/>
            <LeftBottomSection/>
        </div>
    );
}
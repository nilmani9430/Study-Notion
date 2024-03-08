import React from "react";
import HighlightText from "./HighlightText";
import know_your_progress from "../../../assets/images/know_your_progress.png"
import compare_with_others from "../../../assets/images/compare_with_others.png"
import plan_your_lesson from "../../../assets/images/plan_your_lesson.png"
import CTAButton from "../../core/Homepage/Button"


const LearningLanguageSection = () => {
    return (
        <div className="mt-[130px] mb-32">
            <div className="flex flex-col gap-5 items-center">

                <div className="text-4xl font-semibold text-center ">
                    Your Swiss Knife for
                    <HighlightText text={"learning any language"} />
                </div>

                <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[70%]">
                    Using Spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more. 
                </div>

                <div className="flex flex-row items-center justify-center mt-5">
                    <img src={know_your_progress} alt="know_your_progress image" className="object-contain -mr-32"/>
                    <img src={compare_with_others} alt="compare_with_others image" className="object-contain"/>
                    <img src={plan_your_lesson} alt="plan_your_lesson image" className="object-contain -m-36"/>
                </div>

                <div className="w-fit">
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>Learn more</div>

                    </CTAButton>
                </div>

            </div>

        </div>
    )
}

export default LearningLanguageSection 
import React from "react";

import RightArrowIcon from "../../public/svgs/arrow-small-right.svg";

function IntroduceSection() {
  return (
    <div className=" bg-gradient-to-r from-my-deep-ocean to-my-deeper-ocean ">
      <div className="grid  grid-cols-8 gap-y-10 justify-items-center h-[60vh]">
        <div className="col-span-5 font-tiltwrap text-5xl text-gray-100 leading-tight self-center">
          <span> Buy Your Favourite eBooks </span>
          <br />
          <span>With Special Discount.</span>
          <span className="block text-center pt-12">
            <button className=" bg-orange-600 p-2 rounded-md text-xl hover:bg-orange-700 ease-linear duration-200 text-white">
              Get Started <RightArrowIcon className="inline fill-slate-100" />
            </button>
          </span>
        </div>

        <div className="col-span-2 self-end ] ">
          <img
            className=" object-cover rounded-t-md h-[56vh]"
            src="https://res.cloudinary.com/dy9g317c9/image/upload/v1677773448/ebook_web/images/ebook-banner_suxwlf.webp"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default IntroduceSection;
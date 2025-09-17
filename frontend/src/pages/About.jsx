import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt="Desai Hospital"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to <b>Desai Hospital</b>, a trusted healthcare institution
            serving Kolhapur and surrounding areas. We specialize in delivering
            quality medical care with compassion, backed by modern technology
            and expert doctors.
          </p>
          <p>
            With decades of service, Desai Hospital has become a cornerstone for
            families seeking reliable healthcare — from routine check-ups to
            advanced treatments. Our commitment is simple: accessible, affordable,
            and patient-focused care.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            At Desai Hospital, our vision is to ensure that every individual has
            access to world-class healthcare without having to travel far. We aim
            to combine advanced medical facilities with a caring environment,
            making healing easier and more effective.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Experienced Doctors:</b>
          <p>
            A team of MBBS and MD specialists providing expert care in multiple
            fields of medicine.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Modern Facilities:</b>
          <p>
            Equipped with advanced diagnostic tools, operation theaters, and
            emergency care services.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Community Focus:</b>
          <p>
            Regular free health camps and affordable treatment options for
            workers and families in need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

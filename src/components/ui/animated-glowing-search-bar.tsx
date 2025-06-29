import React from 'react';

const SearchComponent = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute z-[-1] w-full h-min-screen"></div>
      <div id="poda" className="relative flex items-center justify-center group">
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[70px] max-w-[314px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                        before:bg-[conic-gradient(#fff,#402fb5_5%,#fff_38%,#fff_50%,#cf30aa_60%,#fff_87%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[65px] max-w-[312px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(255,255,255,0),#18116a,rgba(255,255,255,0)_10%,rgba(255,255,255,0)_50%,#6e1b60,rgba(255,255,255,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[65px] max-w-[312px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(255,255,255,0),#18116a,rgba(255,255,255,0)_10%,rgba(255,255,255,0)_50%,#6e1b60,rgba(255,255,255,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[65px] max-w-[312px] rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(rgba(255,255,255,0),#18116a,rgba(255,255,255,0)_10%,rgba(255,255,255,0)_50%,#6e1b60,rgba(255,255,255,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>

        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[63px] max-w-[307px] rounded-lg blur-[2px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                        before:bg-[conic-gradient(rgba(255,255,255,0)_0%,#a099d8,rgba(255,255,255,0)_8%,rgba(255,255,255,0)_50%,#dfa2da,rgba(255,255,255,0)_58%)] before:brightness-140
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]">
        </div>

        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-[59px] max-w-[303px] rounded-xl blur-[0.5px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70
                        before:bg-[conic-gradient(#ffffff,#402fb5_5%,#ffffff_14%,#ffffff_50%,#cf30aa_60%,#ffffff_64%)] before:brightness-130
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]">
        </div>

        <div id="main" className="relative group">
          <input placeholder="Search..." type="text" name="text" className="bg-white border-2 border-gray-200 w-[301px] h-[56px] rounded-lg text-gray-800 px-[59px] text-lg focus:outline-none placeholder-gray-400" />
          <div id="input-mask" className="pointer-events-none w-[100px] h-[20px] absolute bg-gradient-to-r from-transparent to-white top-[18px] left-[70px] group-focus-within:hidden"></div>
          <div id="pink-mask" className="pointer-events-none w-[30px] h-[20px] absolute bg-[#cf30aa] top-[10px] left-[5px] blur-2xl opacity-80 transition-all duration-2000 group-hover:opacity-0"></div>
          <div className="absolute h-[42px] w-[40px] overflow-hidden top-[7px] right-[7px] rounded-lg
                          before:absolute before:content-[''] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-90
                          before:bg-[conic-gradient(rgba(255,255,255,0),#3d3a4f,rgba(255,255,255,0)_50%,rgba(255,255,255,0)_50%,#3d3a4f,rgba(255,255,255,0)_100%)]
                          before:brightness-135 before:animate-spin-slow">
          </div>
          <div id="filter-icon" className="absolute top-2 right-2 flex items-center justify-center z-[2] max-h-10 max-w-[38px] h-full w-full [isolation:isolate] overflow-hidden rounded-lg bg-gradient-to-b from-[#f8f8f8] via-white to-[#f0f0f0] border border-gray-200">
            <svg preserveAspectRatio="none" height="27" width="27" viewBox="4.8 4.56 14.832 15.408" fill="none">
              <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#666666" strokeWidth="1" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <div id="search-icon" className="absolute left-5 top-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="24" fill="none" className="feather feather-search">
              <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
              <line stroke="url(#searchl)" y2="16.65" y1="22" x2="16.65" x1="22"></line>
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search">
                  <stop stopColor="#6b7280" offset="0%"></stop>
                  <stop stopColor="#4b5563" offset="50%"></stop>
                </linearGradient>
                <linearGradient id="searchl">
                  <stop stopColor="#4b5563" offset="0%"></stop>
                  <stop stopColor="#374151" offset="50%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
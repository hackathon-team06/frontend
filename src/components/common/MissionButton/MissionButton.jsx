export default function MissionButton({title, onClick}) {
    return (
        <div className="flex justify-center">
           <button className="w-36 h-10 relative bg-emerald-300 rounded-3xl shadow-[0px_4px_10.699999809265137px_0px_rgba(68,101,92,0.11)] outline outline-2 outline-offset-[-2px] outline-emerald-300
            text-white text-base font-bold cursor-pointer mb-[23px]" onClick={onClick}>
                {title}
            </button> 
        </div>
    );
}
import character from "../../assets/images/mission_character.png";

function SetUpCharacterSection() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center pt-14 pb-18.5">
      <img className="w-[57px] h-[77px]" src={character} alt="캐릭터" />
      <div className="text-lg font-semibold text-[#2E4972]">
        아직 미션이 정해지지 않았어요..
      </div>
    </div>
  );
}

export default SetUpCharacterSection;

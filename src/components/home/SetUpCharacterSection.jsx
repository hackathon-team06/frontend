import character from "../../assets/images/missioncharacter.svg";

function SetUpCharacterSection() {
  return (
    <div className="flex flex-col gap-2.25 items-center justify-center pt-14 pb-18.5">
      <img className="size-24" src={character} alt="캐릭터" />
      <div className="text-lg font-semibold">
        아직 미션이 정해지지 않았어요..
      </div>
    </div>
  );
}

export default SetUpCharacterSection;

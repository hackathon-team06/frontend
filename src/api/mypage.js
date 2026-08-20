export function toProfile(user) {
  const server = user ?? {};

  return {
    nickname: server.nickname,

    age: server.age,

    skinTypeLabel: `${server.skinType}피부`,

    goal: server.careMotivation || server.goal,

    profileImageUrl: server.profileImageUrl,
  };
}

class User {
  id: string = null;
  msisdnCode: string = null;
  msisdn: string = null;
  username: string = null;
  picture: string = null;
  age: number = 0;
  gender: string = 'male';
  createdAt: Date = null;
  gamesPlayed: number = 0;
  bestScore: number = 0;
  bestScoreToday: number = 0;
  totalPoints: number = 0;
  totalDaysPlaying: number = 0;
  wallet: any = null;
  credits: number = null;
  gamesPlayedToday: number = 0;
  isEligible: boolean = false;
  isSubscribed: boolean = false;
  hasCredit: boolean = false;
  state: string = null;
  
  public toProfileDTO() {
      return {
          id: this.id,
          username: this.username,
          age: this.age,
          gender: this.gender,
          msisdn: this.msisdn
      };
  }
};

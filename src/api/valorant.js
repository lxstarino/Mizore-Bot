class valorant{
    /**
     * Creates an instance of Valorant API
     * 
     * @param {string} baseURL 
     * @memberof valorant
     */

    constructor(baseURL = "https://api.henrikdev.xyz"){
        this.baseURL = baseURL;
    }

    /**
     * Fetches VALORANT Player Data of given User
     * 
     * @param {string} user 
     * @param {string} tag 
     * @returns User Data Object
     * @memberof valorant
     */

    async getUserData(user, tag){
        const MMR_Data = await fetch(`${this.baseURL}/valorant/v2/mmr/eu/${user}/${tag}`)
            .then(response => response.json())
            .catch(() => {throw "An error occured while fetching Player Data"})
        const Account_Data = await fetch(`${this.baseURL}/valorant/v1/account/${user}/${tag}`)
            .then(response => response.json())
            .catch(() => {throw "An error occured while fetching Player Data"})

        if(MMR_Data.status != 200 || Account_Data.status != 200) throw "Not able to contact API"

        return{
            MMR_Data: MMR_Data,
            Account_Data: Account_Data
        }
    }

    
    /**
     * Fetches Valorant Leaderboard Data
     * 
     * @param {string} region
     * @returns Leaderboard Data Object
     * @memberof valorant
     */

    async getLeaderBoardData(region){
        const LeaderBoard_Data = await fetch(`${this.baseURL}/valorant/v1/leaderboard/${region}`)
            .then(response => response.json())
            .catch(() => {throw "An error occured while fetching Leaderboard Data"})

        if(LeaderBoard_Data.status == "404") throw "Failed to fetch leaderboard"
        if(LeaderBoard_Data.status == "429") throw "Rate limited"
        if(LeaderBoard_Data.status == "400") throw "Not able to connect to API"
        if(LeaderBoard_Data.length == 0) throw "No Leaderboard Data found"

        return(LeaderBoard_Data)
    }

    /**
     * Fetches VALORANT Match Data of given User
     * 
     * @param {string} region 
     * @param {string} user 
     * @param {string} tag 
     * @param {string} filter
     * @returns Match Data Object
     * @memberof valorant
     */

    async getMatchData(region, user, tag, filter){
        const Match_Data = await fetch(`${this.baseURL}/valorant/v3/matches/${region}/${user}/${tag}?filter=${filter}`)
            .then(response => response.json())
            .catch(() => {throw "An error occured while fetching Match Data"})

        if(Match_Data.status != 200) throw "Not able to contact API"
        if(Match_Data.data.length == 0) throw "No matches found"

        return(Match_Data)
    }
}

module.exports = valorant;

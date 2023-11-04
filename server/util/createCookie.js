class Cookie  {
    constructor(res, token) {
        this.res = res;
        this.token = token;
    }

    // this is the only method you need to call to attach the cookie to the response
    attachCookie = () => {
        this.res.cookie("access_token", this.token, {
            httpOnly: true,
            sameSite: "None",
            secure: true, 
            maxAge: this.convertExpiration(),
        });
    }

    convertExpiration() {
        const regex = /^(\d+)([a-zA-Z]+)$/;
        const match = this.token.expiresIn.match(regex);
    
        if (match) {
            const time = parseInt(match[1]);
            const unit = match[2].toLowerCase();
            return this._convertTime(time, unit);
        } else {
            console.error("Cookie was not set because of invalid expiration format");
            return null;
        }
    }

    _convertTime = (time, unit) => {
        const date = new Date(); 
    
        switch (unit) {
            case "s":
                date.setSeconds(date.getSeconds() + time);
                break;
            case "m":
                date.setMinutes(date.getMinutes() + time);
                break;
            case "h":
                date.setHours(date.getHours() + time);
                break;
            case "d":
                date.setDate(date.getDate() + time);
                break;
            case "w": 
                date.setDate(date.getDate() + time * 7);
                break;
            default:
                console.error("Invalid time unit:", unit);
                return null;
        }
    
        return date;
    }

    _quickTest = () => {
        // test _convertTime
        const validDate = this._convertTime(10, "w");
        console.log(validDate);
    
        // test converExpiration
        const date = new Date();
    
        const s = this.convertExpiration("40s");
        const d = this.convertExpiration("2d");
        const w = this.convertExpiration("11w");
    
        const sTimeDif = s - date; // seconds
        const dTimeDif = d - date; // days
        const wTimeDif = w - date; // weeks
    
        const secondsRemain = Math.floor((sTimeDif / 1000) % 60);
        const daysRemain = Math.floor(dTimeDif / (1000 * 60 * 60 * 24));
        const weeksRemain = Math.floor(wTimeDif / (1000 * 60 * 60 * 24 * 7));
    
    
        console.log(secondsRemain, "seconds");
        console.log(daysRemain, "days");
        console.log(weeksRemain, "weeks");
    }
}

module.exports = Cookie;
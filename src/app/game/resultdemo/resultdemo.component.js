"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var uikit_1 = require('uikit');
var ResultdemoComponent = (function () {
    function ResultdemoComponent(dataService, session, router) {
        this.dataService = dataService;
        this.session = session;
        this.router = router;
        // if(this._firstTime && this._cashbackAmount == 0)
        //     return "This is just the start!";
        //   if(this._firstTime && this._cashbackAmount > 0 && this._rightAnswerCount <= 5)
        //     return "Well done for taking that cash!";
        //   if(this._rightAnswerCount >= 10 && this._cashbackAmount > 0)
        //     return "Excellent!";
        //   if(this._rightAnswerCount <= 5 && this._cashbackAmount == 0)
        //     return "Not as good as last time...";
        this._firstTime = false;
        this._gamesPlayed = 2;
        this._rightAnswerCount = 10;
        this._cashbackAmount = 0;
        this._secondVariant = true;
    }
    Object.defineProperty(ResultdemoComponent.prototype, "secondVariant", {
        get: function () {
            return this._secondVariant;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultdemoComponent.prototype, "cashbackAmount", {
        get: function () {
            return this._cashbackAmount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultdemoComponent.prototype, "rightAnswerCount", {
        get: function () {
            return this._rightAnswerCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultdemoComponent.prototype, "gamesPlayed", {
        get: function () {
            return this._gamesPlayed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultdemoComponent.prototype, "TopText", {
        get: function () {
            if (this._rightAnswerCount == 0)
                return "???????";
            if (this._rightAnswerCount == 1)
                return "???????????????";
            if (this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
                return "????????????!";
            if (this._rightAnswerCount >= 5 && this._rightAnswerCount <= 9)
                return "????????????????????????!";
            if (this._rightAnswerCount >= 10)
                return "??????????????????!";
        },
        enumerable: true,
        configurable: true
    });
    ResultdemoComponent.prototype.ngOnInit = function () {
        if (!this.session.lastGameResults)
            this.router.navigate(['home']);
        this._rightAnswerCount = this.session.lastGameResults.correctAnswers;
        this._cashbackAmount = this.session.lastGameResults.cashbackWon || 0;
        this._firstTime = this.session.gamesPlayed == 1;
        this._gamesPlayed = +localStorage.getItem('demoGamesPlayed');
        console.log("Games Played: " + this._gamesPlayed);
        // If CashBack Won Set tothan
        this._cashbackAmount > 0;
        localStorage.setItem('demoCashWon', "10");
        var modal = uikit_1["default"].modal("#result");
        setTimeout(function () { modal.show(); }, 1000);
    };
    ResultdemoComponent.prototype.startGame = function () {
        this._gamesPlayed++;
        localStorage.setItem('demoGamesPlayed', this._gamesPlayed.toString());
        console.log("Goto Demo Game!");
        this.router.navigate(['demogame']);
    };
    ResultdemoComponent.prototype.goHome = function () {
        console.log("Goto Return Home!");
        this.router.navigate(['home']);
    };
    ResultdemoComponent.prototype.subscribe = function ($event) {
        console.log('button is clicked');
        $event.stopPropagation();
        this.dataService.authenticateRedirect();
    };
    ResultdemoComponent = __decorate([
        core_1.Component({
            selector: 'app-resultdemo',
            templateUrl: './resultdemo.component.html',
            styleUrls: ['./resultdemo.component.scss']
        })
    ], ResultdemoComponent);
    return ResultdemoComponent;
}());
exports.ResultdemoComponent = ResultdemoComponent;

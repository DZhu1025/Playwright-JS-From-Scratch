

export class loginPage{

    constructor(page){
        this.page = page

    };

    async goto(){
       await this.page.goto('login');
    };


};
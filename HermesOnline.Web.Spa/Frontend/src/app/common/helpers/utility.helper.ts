// tslint:disable:no-bitwise
// tslint:disable:max-line-length

export class UtilityHelper {
    private static S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    public static newGuid(): string {
        const guid = (this.S4() + this.S4() + '-' + this.S4() + '-4' + this.S4().substr(0, 3) + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4()).toLowerCase();
        return guid;
    }
}

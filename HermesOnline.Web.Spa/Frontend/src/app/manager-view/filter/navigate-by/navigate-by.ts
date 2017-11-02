export class NavigateBy {

    public getNumOfColumn(array: any): number {
        if (array) {
            return Math.floor(array.length / 12) + 1;
        } else {
            return 1;
        }
    }

}
export class SeverityColorMapper {
    static getCssClassBySeverity(severity: number) {
        switch (severity) {
            case 0: return 'severity_0';
            case 1: return 'severity_1';
            case 2: return 'severity_2';
            case 3: return 'severity_3';
            case 4: return 'severity_4';
            case 5: return 'severity_5';
            default: return 'severity_undefined';
        }
    }

    static getCssClassBySeverityUnselected(severity: number) {
        switch (severity) {
            case 0: return 'severity_0_unselected';
            case 1: return 'severity_1_unselected';
            case 2: return 'severity_2_unselected';
            case 3: return 'severity_3_unselected';
            case 4: return 'severity_4_unselected';
            case 5: return 'severity_5_unselected';
            default: return 'severity_undefined_unselected';
        }
    }

    static getColorHexValueBySeverity(severity: number) {
        switch (severity) {
            case 0: return '#fff2e3';
            case 1: return '#fcd5a6';
            case 2: return '#fab45e';
            case 3: return '#ee753f';
            case 4: return '#cd3454';
            case 5: return '#ba0e49';
            default: return '#c8c1ce';
        }
    }
}


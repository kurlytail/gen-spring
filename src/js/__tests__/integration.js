import { execSync } from 'child_process';

describe('# integration test', () => {
    beforeEach(() => {
        execSync('rm -rf testoutput');
    });

    it('## should generate design and run spring commands', () => {
        let output = execSync('npm run build').toString();
        output = execSync('sgen -g `pwd`/dist/spring.min.js -d src/test/fixture/design.json -o testoutput').toString();
        output = output.replace(/info: Loaded generator .*spring.min.js.*/, '');
        output = output
            .replace(/warn: Please cherrypick changes from master-sgen-generated from .*/, '')
            .replace(/info: git cherry-pick .*/, '');
        expect(output).toMatchSnapshot();
    });
});

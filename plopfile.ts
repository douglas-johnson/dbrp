import type {NodePlopAPI} from 'plop';

export default async function (plop: NodePlopAPI) {
  // stories file generator
  plop.setGenerator('stories', {
    description: 'generate a new storybook stories file',
    prompts: [
      {
        type: 'input',
        name: 'component',
        message: 'component name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${process.cwd()}/{{component}}.stories.ts`,
        templateFile: 'plop-templates/stories.hbs',
      },
    ],
  });
}

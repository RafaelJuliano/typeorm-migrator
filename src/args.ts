import { ArgumentParser } from 'argparse'

export const getArgs = () => {
  const parser = new ArgumentParser({
    description: 'Exemplo de aplicativo com argparse',
  })

  parser.add_argument('command', { type: 'string', help: 'Migration command' })
  parser.add_argument('-f', '--migrationFolder', {
    type: 'string',
    help: 'Migrations folder',
    required: true,
  })

  return parser.parse_args()
}

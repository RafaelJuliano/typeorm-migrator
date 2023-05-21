import { ArgumentParser } from 'argparse'

export const getArgs = () => {
  const parser = new ArgumentParser({
    description: 'Exemplo de aplicativo com argparse',
  })

  parser.add_argument('command', { type: 'str', help: 'Migration command' })
  parser.add_argument('-f', '--migrationFolder', {
    type: 'str',
    help: 'Migrations folder',
    required: true,
  })

  return parser.parse_args()
}

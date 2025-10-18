function info(...args: string[]) {
  console.log(...args)
}

function error(...args: string[]) {
  console.error(...args)
}

export default { info, error }

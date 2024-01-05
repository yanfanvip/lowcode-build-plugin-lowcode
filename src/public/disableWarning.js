const consoleError = console.error;

console.error = function (...args) {
  
  if(args.includes('fieldProps')){ return }
  if(args.includes("defaultRender")){ return }
  if(args.includes("searchConfig")){ return }
  if(args.includes("multi") && args.includes("false")){ return }
  if(args.includes("loading") && args.includes("false")){ return }
  if(args.includes('\n\nCheck the render method of `Config(Dialog3)`.')){ return }

  console.log(args)
  consoleError.apply(console, args);
}
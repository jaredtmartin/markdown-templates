import { render as renderMarkdown } from './markdown';

export const render = (template, context, rules) => {
  // template is the string to render
  // context is an object with values we want to use in our template
  // rules is an optional array of markdown rules, 
  // if you want something to start with, import the default set of rules from the markdown file
  const markdown = renderTemplate(template, context);
  const html = renderMarkdown(markdown, rules);
  return html;
}
export const renderVariables = (template, context) => {
  // Replace variables with top-level values from context
  var keys = Object.keys(context);
  for (var i = 0; i < keys.length; i++) {
    if (!context[keys[i]]) template = template.replace(new RegExp("{{"+keys[i]+"}}", "g"), context[keys[i]]);
    else template = template.replace(new RegExp("{{"+keys[i]+"}}", "g"), context[keys[i]]);
  };
  return template;
}
export const renderForEach = (template, array, context) => {
  // render each object in an array with the given template
  if (typeof array !== "array") throw new Error("The second argument passed to forEach must be an array");
  return array.map((eachItem, i)=>renderVariables(template, { i, eachItem, ...context })).join("");
}

const chooseNext = (template, forEachRegex, withRegex) => {
  // Find the next special tag we need to interpret
  const nextFor = template.match(forEachRegex);
  const nextWith = template.match(withRegex);
  // console.dir({nextFor, nextWith});
  if (nextFor){
    if (nextWith){
      if (nextFor<nextWith) return "for";
      else return "with";
    }  else return "for";
  } else {
    if (nextWith) return "with"
  }
}
export const renderTemplate = (template, context) => {
  // Render forEach and with tags
  const forEachRegex = / *{{forEach (.*) in (.*)}}\n *([\s\S]*?)\n *{{endFor}} */;
  const withRegex = / *{{with (.*)}} *\n([\s\S]*?)\n *{{endWith}} */;
  // console.log(`template:${template}`);
  let next = chooseNext(template, forEachRegex, withRegex);
  // console.warn(next);
  // console.dir({ nextFor:nextFor&&nextFor.index, nextWith:nextWith&&nextWith.index, next });

  // const m = template.match(regex);
  // console.dir({ m });
  while(next){
    if (next==="for"){
      // The next item to handle is the for
      template = template.replace(forEachRegex, (all,varName,array,partial,count)=>{
        // console.dir({type:"FOR", all,varName,array,partial,count});
        return context[array].map((item, i) => renderTemplate(partial, { i, [varName]:item, ...context })).join("\n");
      })
    } else {
      // The next item to handle is the with
      template = template.replace(withRegex, (all,varName,partial,count)=>{
        // console.dir({ type:"WITH", all,varName,partial,count });
        return renderTemplate(partial, { ...context[varName], ...context });
      })
    }

    // template = template.replace(regex, (all,varName,array,partial,count)=>{
    //   console.dir({all,varName,array,partial,count});
    //   // renderForEach(partial, { [varName]:context[], ...context })
    //   return context[array].map((item, i) => renderVariables(partial, { i, [varName]:item, ...context })).join("");
    // })
    // console.log(`template:${template}`);
    // console.log(typeof template);
    next = chooseNext(template, forEachRegex, withRegex);
    // console.warn(next);
    // console.dir({ nextFor:nextFor&&nextFor.index, nextWith:nextWith&&nextWith.index });
  }
  template = renderVariables(template, context);
  // console.log(`template:${template}`);
  return template;
}

export function populateEmailTemplate(template, data) {
    return template.replace(/{{(\w+)}}/g, (_, key) => {
      return data[key] || `{{${key}}}`
    });
  }
  
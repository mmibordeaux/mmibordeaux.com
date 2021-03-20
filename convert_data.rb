require 'yaml'
bibliography = YAML.load(File.read("_data/bibliography.yml"))

bibliography.each do |resource|
  slug = resource['slug']
  yml = resource.to_yaml
  File.write("_bibliography/#{slug}.md", "#{yml}---")
end

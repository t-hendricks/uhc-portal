# Forked from https://github.com/openshift/verification-tests/blob/master/features/step_definitions/ocm.rb
# with modified path for *.xyaml rules.

require 'webauto/webconsole_executor'

# We can't stop existing verification-tests/features/step_definitions/ocm.rb from
# being loaded too.
def unregister_steps_matching!(str)
  # Written for Cucumber 2.4.0 internals. Yikes.
  lang = Cucumber::RbSupport::RbDsl.instance_variable_get(:@rb_language)
  definition_array = lang.instance_variable_get(:@step_definitions)
  definition_hash = lang.instance_variable_get(:@available_step_definition_hash)

  lang.step_matches(str).each do |match|
    puts "unregister_steps_matching!: forgetting #{match.inspect}"
    step = match.step_definition
    definition_array.delete(step)
    key = Cucumber::StepDefinitionLight.new(step.regexp_source, step.file_colon_line)
    definition_hash.delete(key)
  end
end

unregister_steps_matching!('I open ocm portal as a foo user')

Given /^I open ocm portal as an? #{WORD} user$/ do |usertype|
  upstream_rules = "lib/rules/web/ocm_console/"
  our_rules = "our-tests/lib/rules/web/ocm_console/"
  # Should we load both upstream_rules and our_rules?
  # No! Want to be sure what we're running is our copy, or get "have no ... rules" error.

  snippets_dir = BushSlicer::WebConsoleExecutor::SNIPPETS_DIR
  base_url = env.web_console_url
  step "I have a browser with:", table(%{
    | rules        | #{our_rules}    |
    | base_url     | #{base_url}     |
    | snippets_dir | #{snippets_dir} |
  })
  browser.browser.goto base_url
  @result = browser.run_action(:login_ocm_sequence,
                               username: env.static_user(usertype).loginname,
                               password: env.static_user(usertype).password)
end

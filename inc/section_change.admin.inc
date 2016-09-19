<?php

/**
 * @file
 * Trial Card SMS admin file.
 */

/**
 * Implements hook_form().
 */
function section_change_admin_form() {
  $form = array();

  $form['pfe_trial_card_sms_webform_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Webform ID'),
    '#description' => t('The ID of the webform used for Trial Card.'),
    '#default_value' => variable_get('pfe_trial_card_sms_webform_id'),
    '#size' => 50,
    '#required' => TRUE,
  );

  return system_settings_form($form);
}

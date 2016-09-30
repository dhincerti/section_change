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

  $form['section_change_view_selector'] = array(
    '#type' => 'textfield',
    '#title' => t('View selector'),
    '#description' => t('The ID, class or any css identifier of the main view container.'),
    '#default_value' => variable_get('section_change_view_selector'),
    '#size' => 50,
    '#required' => TRUE,
  );

  $form['section_change_only_hash'] = array(
    '#type' => 'checkbox',
    '#title' => t('Only hash'),
    '#description' => t('Check if you site sections only change hash instead of path.'),
    '#default_value' => variable_get('section_change_only_hash', false),
  );

  $form['section_change_data_section_name'] = array(
    '#type' => 'textfield',
    '#title' => t('Data section name'),
    '#description' => t('Change it if you view row has another data name'),
    '#field_prefix' => 'data-',
    '#default_value' => variable_get('section_change_data_section_name', 'section'),
    '#size' => 50,
    '#required' => TRUE,
  );

  $form['section_change_views_row_selector'] = array(
    '#type' => 'textfield',
    '#title' => t('View row selector'),
    '#description' => t('The ID, class or any css identifier of the views row.'),
    '#default_value' => variable_get('section_change_views_row_selector', '.views-row'),
    '#size' => 50,
    '#required' => TRUE,
  );

  $form['section_change_animation_time'] = array(
    '#type' => 'textfield',
    '#title' => t('Animation time'),
    '#description' => t('The animation time in milliseconds.'),
    '#default_value' => variable_get('section_change_animation_time', 500),
    '#field_suffix' => 'ms',
    '#size' => 1,
    '#required' => TRUE,
  );

  $form['section_change_discount'] = array(
    '#type' => 'textarea',
    '#title' => t('Discount'),
    '#description' => t('The window discount if aplicable. Can be number or function.'),
    '#default_value' => variable_get('section_change_discount'),
    '#size' => 50,
  );

  $form['section_change_ignore'] = array(
    '#type' => 'textfield',
    '#title' => t('Ignored row section'),
    '#description' => t('The ID, class or any css identifier of the row section to be ignored.'),
    '#default_value' => variable_get('section_change_ignore'),
    '#size' => 50,
  );

  $form['section_change_links_selector'] = array(
    '#type' => 'textfield',
    '#title' => t('Links'),
    '#description' => t('The ID, class or any css identifier of the links that point to an section on the page.'),
    '#default_value' => variable_get('section_change_links_selector'),
    '#size' => 50,
  );

  return system_settings_form($form);
}

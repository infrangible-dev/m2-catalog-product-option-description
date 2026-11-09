/**
 * @author      Andreas Knollmann
 * @copyright   Copyright (c) 2014-2025 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

define([
    'jquery',
    'domReady',
    'dropdownDialog'
], function ($, domReady) {
    'use strict';

    const globalOptions = {
        descriptions: {}
    };

    $.widget('mage.productOptionsDescription', {
        options: globalOptions,

        _create: function createProductOptionsDescription() {
        },

        _init: function initProductOptionsDescription() {
            const self = this;

            domReady(function() {
                if (self.options.descriptions.description) {
                    const description = $('<div>', {class: 'product-options-description'});
                    description.html(self.options.descriptions.description);

                    $('#product-options-wrapper').prepend(description);
                }

                if (self.options.descriptions.options) {
                    $.each(self.options.descriptions.options, function(optionId, optionData) {
                        if (optionData.description) {
                            self.updateOptionDescription(optionId, optionData.description);
                        }
                    });
                }

                $('#product_addtocart_form .product-custom-option').on('change', function(event) {
                    const option = $(event.target);
                    const optionWrapper = option.closest('div[data-option-id]');

                    const optionId = optionWrapper.data('option-id');

                    if (optionId && self.options.descriptions.options && self.options.descriptions.options[optionId]) {
                        const optionData = self.options.descriptions.options[optionId];

                        if (optionData && optionData.values) {
                            // @todo: support multiselect and multiple checked checkboxes
                            const nodeName = option.prop('nodeName');
                            let optionValue = null;
                            if (nodeName === 'SELECT') {
                                optionValue = option.val();
                            } else if (nodeName === 'INPUT') {
                                const type = option.attr('type');
                                if (type === 'radio') {
                                    if (option.is(':checked')) {
                                        optionValue = option.val();
                                    }
                                } else if (type === 'checkbox') {
                                    if (option.is(':checked')) {
                                        optionValue = option.val();
                                    }
                                }
                            }

                            if (optionValue && optionData.values[optionValue]) {
                                const optionValueData = optionData.values[optionValue];

                                if (optionValueData.description) {
                                    self.updateOptionDescription(optionId, optionValueData.description);
                                }
                            } else if (optionData.description) {
                                self.updateOptionDescription(optionId, optionData.description);
                            } else {
                                self.removeOptionDescription(optionId);
                            }
                        }
                    }
                });
            });
        },

        updateOptionDescription: function updateOptionDescription(optionId, description) {
            this.removeOptionDescription(optionId);

            const shortDescription = $('<div>', {class: 'product-option-short-description'});
            shortDescription.html(description);

            let label = $('div[data-option-id="' + optionId + '"] > div.field > label.label');
            if (label.length === 0) {
                label = $('div[data-option-id="' + optionId + '"] > div.field > fieldset.fieldset-product-options-inner legend.legend');
            }

            if (label.length > 0) {
                label.after(shortDescription);
            }
        },

        removeOptionDescription: function removeOptionDescription(optionId) {
            let label = $('div[data-option-id="' + optionId + '"] > div.field > label.label');
            if (label.length === 0) {
                label = $('div[data-option-id="' + optionId + '"] > div.field > fieldset.fieldset-product-options-inner legend.legend');
            }

            if (label.length > 0) {
                const previousDescription = label.parent().find('.product-option-short-description');
                if (previousDescription.length > 0) {
                    previousDescription.remove();
                }
            }
        }
    });

    return $.mage.productOptionsDescription;
});

$(document).ready(function () {

    //GENERAL FUNCTIONS
    function showDiv(target) {
        if (target === 'average') {
            divAverage.show();
            divRule.hide();
            divPercentage.hide();
        } else if (target === 'rule') {
            divRule.show();
            divAverage.hide();
            divPercentage.hide();
        } else if (target === 'percentage') {
            divPercentage.show();
            divRule.hide();
            divAverage.hide();
        }
    }
    //GENERAL FUNCTIONS - END


    //INITIAL STATE
    divAverage = $('#average');
    divRule = $('#rule');
    divPercentage = $('#percentage');

    divAverage.hide();
    divRule.hide();
    divPercentage.hide();

    $('#btn-average').click(function () {
        showDiv('average');
    });

    $('#btn-rule').click(function () {
        showDiv('rule');
    });

    $('#btn-percentage').click(function () {
        showDiv('percentage');
    });


    //Average
    function mlCheckSeparator(string, sep) {
        return string.indexOf(sep) > -1;
    }

    function mlTrim(x) {
        return x.replace(/^\s+|\s+$/gm, '');
    }

    function mlCheckFloat(item) {
        if (isNaN(item)) {
            return false;
        }
        return parseFloat(item);
    }

    String.prototype.trimRight = function (charlist) {
        if (charlist === undefined)
            charlist = "\s";

        return this.replace(new RegExp("[" + charlist + "]+$"), "");
    };

    function ml_filter_array(test_array) {
        var index = -1,
            arr_length = test_array ? test_array.length : 0,
            resIndex = -1,
            result = [];

        while (++index < arr_length) {
            var value = test_array[index];
            if (value || value === 0) {
                result[++resIndex] = value;
            }
        }
        return result;
    }

    function isEmpty(value) {
        return (value == null || value.length === 0 || value === '');
    }

    function getFormObj(formElement) {
        var formObj = {};
        var inputs = formElement.serializeArray();
        $.each(inputs, function (i, input) {
            formObj[input.name] = input.value;
        });
        return formObj;
    }


    $('div#average #result-field').hide();
    $('div#average #btn-copy-result').hide();
    $('div#average #conta-average').hide();

    var clipboardAverage = new ClipboardJS('div#average #btn-copy-result');
    clipboardAverage.on('success', function (e) {
        //           console.info('Action:', e.action);
        //           console.info('Text:', e.text);
        //           console.info('Trigger:', e.trigger);

        $('div#average #btn-copy-result').text("Copied!").addClass('btn-success');

        e.clearSelection();
    });

    clipboardAverage.on('error', function (e) {
        //           console.error('Action:', e.action);
        //           console.error('Trigger:', e.trigger);
        return false;
    });


    $('div#average input#values').keyup(function () {
        if ($(this).val().length > 0) {
            $('div#average input#send-values').prop('disabled', false);
        } else {
            $('div#average input#send-values').prop('disabled', true);
        }
    });

    $('form#average').on('submit', function (event) {
        event.preventDefault();
        $('div#average #result-average').empty();
        $('div#average #result-field').hide();
        $('div#average #btn-copy-result').hide().text("Copy result").removeClass('btn-success');
        $('div#average #conta-average').empty().hide();
        const data = getFormObj($(this));
        let values;
        let arrayValues;
        let arrayItem;
        let objectItem;
        let cancel = '';
        const separator = ',';

        if (isEmpty(data.values)) {
            alert('No value to calculate');
            return;
        }

        values = mlTrim(data.values).replace(/^\,+|\,+$/g, '');


        //peso um pra tudo
        arrayValues = values.split(separator).map(function (item) {
            objItem = new Object();

            if (item.indexOf(":") > -1) {
                arrayItem = item.split(":").map(function (i_item) {
                    if (isNaN(i_item)) {
                        cancel = 'Non numeric value found. Please fill the "values" field again.';
                        return;
                    }
                    return parseFloat(i_item);
                });

                objItem.value = parseFloat(arrayItem[0]);
                objItem.weight = parseFloat(arrayItem[1]);
            } //END if( item.indexOf(":") === -1 ) 

            else {
                if (isNaN(item)) {
                    cancel = 'Non numeric value found. Please fill the "values" field again.';
                    return;
                }
                objItem.value = parseFloat(item);
                objItem.weight = 1;
            } //END else if( item.indexOf(":") === -1 ) 

            return objItem;
        }); //END map function on arrayValues


        if (!isEmpty(cancel)) {
            alert(cancel);
            return;
        }

        var i;
        let totalValue = 0;
        let totalWeight = 0;
        for (i = 0; i < arrayValues.length; i++) {
            if (isNaN(arrayValues[i].value) || isNaN(arrayValues[i].weight)) {
                continue;
            }
            totalValue += (arrayValues[i].value * arrayValues[i].weight);
            totalWeight += arrayValues[i].weight;
        }

        let average = totalValue / totalWeight;
        if ($('div#average input#limita').is(':checked')) {
            average = Math.round((average + Number.EPSILON) * 100) / 100;
        }
        if (!isEmpty(average)) {
            $('div#average #result-average').text(average);
            $('div#average #result-field').show();
            $('div#average #btn-copy-result').show();
            $('div#average #conta-average').text(totalValue + " ÷ " + totalWeight).show();
        }
    });

    //clicking limit checkbox
    $('div#average input#limita').change(function () {
        if (isEmpty($('span#result-average').text())) {
            return false;
        }
        $('div#average input#send-values').trigger("click");
    });

    $('div#average input.input-block').on('keyup keydown change', function () {
        $('div#average #result-average').empty();
        $('div#average #result-field').hide();
        $('div#average #btn-copy-result').hide().text("Copy result").removeClass('btn-success');
        $('div#average #conta-average').empty().hide();
    });
    //End Average


    //Rule
    function isEmptyRule(value) {
        return (value == null || value.length === 0 || value === '' || value === false);
    }

    var clipboardRule = new ClipboardJS('div#rule #btn-copy-result-rule');
    clipboardRule.on('success', function (e) {
        //           console.info('Action:', e.action);
        //           console.info('Text:', e.text);
        //           console.info('Trigger:', e.trigger);

        $('div#rule #btn-copy-result-rule').text("Copied!").addClass('btn-success');

        e.clearSelection();
    });

    clipboardRule.on('error', function (e) {
        //           console.error('Action:', e.action);
        //           console.error('Trigger:', e.trigger);
        return false;
    });


    $('div#rule #btn-gabarito').on('click', function () {
        $('div#rule div.gabarito').show();
    });

    $('div#rule #btn-clean').on('click', function () {
        $('div#rule input#value1').val('').removeClass('background-success');
        $('div#rule input#value2').val('').removeClass('background-success');
        $('div#rule input#value3').val('').removeClass('background-success');
        $('div#rule input#value4').val('').removeClass('background-success');
        $('#conta-rule').empty();
        $('div#rule #row-conta-rule').hide();
        $('div#rule input#limita-rule').attr('data-full-result', '');
        $('div#rule #btn-copy-result-rule').text("Copy result").removeClass('btn-success');
    });

    $('div#rule input.input-block').on('keyup keydown change', function () {

        let elementTyped = $(this);
        var z = 0;
        let x;
        let value1 = $('div#rule input#value1').val();
        let value2 = $('div#rule input#value2').val();
        let value3 = $('div#rule input#value3').val();
        let value4 = $('div#rule input#value4').val();
        let elementx;
        let multiple1;
        let multiple2;
        let divider;
        let result;
        $('div#rule input#value1').removeClass('background-success');
        $('div#rule input#value2').removeClass('background-success');
        $('div#rule input#value3').removeClass('background-success');
        $('div#rule input#value4').removeClass('background-success');
        $('div#rule input#limita-rule').attr('data-full-result', '');
        $('div#rule #btn-copy-result-rule').text("Copy result").removeClass('btn-success');

        $('div#rule input.input-block').each(function () {

            if (!isEmptyRule($(this).val())) {
                z++;
            }
            if (z === 3) {
                //time to calculate...
                elementx = $('div#rule input.input-block').filter(function () { return this.value == '' });
                switch (elementx.attr('id')) {
                    case 'value1':
                        divider = value4;
                        multiple1 = value3;
                        multiple2 = value2;
                        break;
                    case 'value2':
                        divider = value3;
                        multiple1 = value1;
                        multiple2 = value4;
                        break;
                    case 'value3':
                        divider = value2;
                        multiple1 = value1;
                        multiple2 = value4;
                        break;
                    case 'value4':
                        divider = value1;
                        multiple1 = value3;
                        multiple2 = value2;
                        break;
                } //end switch
                result = multiple1 * multiple2 / divider;
                if ($('div#rule input#limita').is(':checked')) {
                    result = Math.round((result + Number.EPSILON) * 100) / 100;
                }
                elementx.val(result).addClass('background-success');
                $('#conta-rule').text('(' + multiple1 + ' x ' + multiple2 + ') / ' + divider);
                $('div#rule #row-conta-rule').show();
            } else if (z === 4) {
                //time to calculate...
                switch (elementTyped.attr('id')) {
                    case 'value1':
                        elementx = $('div#rule input#value2')
                        divider = value3;
                        multiple1 = value1;
                        multiple2 = value4;
                        break;
                    case 'value2':
                        elementx = $('div#rule input#value1')
                        divider = value4;
                        multiple1 = value2;
                        multiple2 = value3;
                        break;
                    case 'value3':
                        elementx = $('div#rule input#value4')
                        divider = value1;
                        multiple1 = value3;
                        multiple2 = value2;
                        break;
                    case 'value4':
                        elementx = $('div#rule input#value3')
                        divider = value2;
                        multiple1 = value1;
                        multiple2 = value4;
                        break;
                } //end switch
                result = multiple1 * multiple2 / divider;
                $('div#rule input#limita-rule').attr('data-full-result', result);
                if ($('div#rule input#limita-rule').is(':checked')) {
                    result = Math.round((result + Number.EPSILON) * 100) / 100;
                }
                elementx.val(result).addClass('background-success');
                $('#conta-rule').text('(' + multiple1 + ' x ' + multiple2 + ') / ' + divider);
                $('div#rule #row-conta-rule').show();
            }

        });

    });

    //clicking limit checkbox
    $('div#rule input#limita-rule').change(function () {
        $('div#rule #btn-copy-result-rule').text("Copy result").removeClass('btn-success');
        let limitaRule = $(this);
        let resultRuleVal = $(this).attr('data-full-result');
        let resultRuleValNew = resultRuleVal;
        if (isEmptyRule(resultRuleVal)) {
            return false;
        } else {
            resultRuleVal = parseFloat(resultRuleVal);
        }
        //checking input with class background-success
        $('div#rule input.input-block').each(function () {
            if ($(this).hasClass('background-success')) {
                //the one!
                if (limitaRule.is(':checked')) {
                    resultRuleValNew = Math.round((resultRuleVal + Number.EPSILON) * 100) / 100;
                }
                $(this).val(resultRuleValNew);
                // $('#conta-rule-result').text(resultRuleValNew);
                return false;
            }
        });

    });
    //End Rule


    //Percentage
    function isNotValidForPercentage(value) {
        return (value == null ||
            value.length === 0 ||
            value === '' ||
            value === false ||
            isNaN(value));
    }

    function isNotValidOperation(value) {
        return (value == null ||
            value.length === 0 ||
            value === '' ||
            value === false ||
            (value !== 'first' &&
                value !== 'second' &&
                value !== 'third' &&
                value !== 'fourth'));
    }

    function percentFirst(input_1, input_2) {
        var c = (parseFloat(input_1) / 100) * parseFloat(input_2);
        return parseFloat(c);
    }

    function percentSecond(input_1, input_2) {
        var c = (parseFloat(input_1) / parseFloat(input_2)) * 100;
        return parseFloat(c);
    }

    function percentThird(input_1, input_2) {
        var c = (parseFloat(input_1) * 100) / parseFloat(input_2);
        return parseFloat(c);
    }

    function percentFourth(input_1, input_2) {
        var c = ((parseFloat(input_2) - parseFloat(input_1)) / parseFloat(input_1)) * 100;
        return parseFloat(c);
    }

    var clipboardAverage = new ClipboardJS('#btn-copy-result-percentage');
    clipboardAverage.on('success', function (e) {
        //           console.info('Action:', e.action);
        //           console.info('Text:', e.text);
        //           console.info('Trigger:', e.trigger);

        $('#btn-copy-result-percentage').text("Copied!").addClass('btn-success');

        e.clearSelection();
    });

    clipboardAverage.on('error', function (e) {

        //           console.error('Action:', e.action);
        //           console.error('Trigger:', e.trigger);
        return false;
    });

    //initial state
    $('.row-percentage-result').hide();
    $('#btn-copy-result-percentage').text("Copy result").removeClass('btn-success');

    $('input.input-go').on('click', function () {
        $('#btn-copy-result-percentage').text("Copy result").removeClass('btn-success');
        $('.row-percentage-result').hide();
        let operation = $(this).attr('data-operation');
        let inputParent = $(this).parent();
        let input_1 = inputParent.find('input[name="value1"]').val();
        let input_2 = inputParent.find('input[name="value2"]').val();
        if (isNotValidForPercentage(input_1) || isNotValidForPercentage(input_2) || isNotValidOperation(operation)) {
            return;
        }

        let result = '';
        let percentSymbol = false;
        if (operation === 'first') {
            //What is [input_1]% of [input_2]?
            result = percentFirst(input_1, input_2);
            // console.log(result);
        } else if (operation === 'second') {
            //[input_1] is what % of [input_2]?
            result = percentSecond(input_1, input_2);
            percentSymbol = true;
        } else if (operation === 'third') {
            //[input_1] is [input_2]% of what?
            result = percentThird(input_1, input_2);
        } else if (operation === 'fourth') {
            //From [input_1] to [input_2] is what %?
            result = percentFourth(input_1, input_2);
            percentSymbol = true;
        }

        if (isNotValidForPercentage(result) === false) {

            if ($('div#percentage input#limita-percentage').is(':checked')) {
                result = Math.round((result + Number.EPSILON) * 100) / 100;
            }

            if (percentSymbol) {
                result = `${result}%`;
            }

            $('#result-percentage').text(result);
            $('.row-percentage-result').show();
        } else {
            alert('Invalid operation. Please, try again.');
        }
    });
    //End Percentage

}); //end jquery
import {
    InputFieldFF,
    ReactFinalForm,
    composeValidators,
    hasValue,
    url,
} from '@dhis2/ui'
import React from 'react'
import i18n from '../../locales'
import { dataTest } from '../../utils'

const { Field } = ReactFinalForm

export const FieldGatewayUrlTemplate = () => (
    <Field
        required
        dataTest={dataTest('gateways-fieldgatewayurltemplate')}
        name="urlTemplate"
        label={i18n.t('Url template')}
        component={InputFieldFF}
        validate={composeValidators(url, hasValue)}
    />
)

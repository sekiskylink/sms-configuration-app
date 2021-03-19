import {
    InputFieldFF,
    ReactFinalForm,
    composeValidators,
    hasValue,
    string,
} from '@dhis2/ui'
import React from 'react'
import i18n from '../../locales'
import { dataTest } from '../../utils'

const { Field } = ReactFinalForm

export const FieldGatewayUsername = () => (
    <Field
        required
        dataTest={dataTest('gateways-fieldgatewayusername')}
        name="username"
        label={i18n.t('User name')}
        component={InputFieldFF}
        validate={composeValidators(string, hasValue)}
    />
)

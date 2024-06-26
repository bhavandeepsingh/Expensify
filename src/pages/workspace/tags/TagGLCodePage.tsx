import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {withOnyx} from 'react-native-onyx';
import type {OnyxEntry} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import TextInput from '@components/TextInput';
import useAutoFocusInput from '@hooks/useAutoFocusInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@libs/Navigation/Navigation';
import type {SettingsNavigatorParamList} from '@navigation/types';
import AccessOrNotFoundWrapper from '@pages/workspace/AccessOrNotFoundWrapper';
import * as Tag from '@userActions/Policy/Tag';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import INPUT_IDS from '@src/types/form/WorkspaceTagForm';
import type {PolicyTagList} from '@src/types/onyx';

type WorkspaceEditTagGLCodePageOnyxProps = {
    /** Collection of categories attached to a policy */
    policyTags: OnyxEntry<PolicyTagList>;
};

type EditCategoryPageProps = WorkspaceEditTagGLCodePageOnyxProps & StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.CATEGORY_PAYROLL_CODE>;

function TagGLCodePage({route, policyTags}: EditCategoryPageProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const tagName = route.params.tagName;
    const orderWeight = route.params.orderWeight;
    const glCode = policyTags?.[tagName];
    const {inputCallbackRef} = useAutoFocusInput();

    const editGLCode = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.WORKSPACE_CATEGORY_FORM>) => {
            const newGLCode = values.glCode.trim();
            if (newGLCode !== glCode) {
                Tag.setPolicyTagGLCode(route.params.policyID, tagName, orderWeight, newGLCode);
            }
            Navigation.goBack();
        },
        [glCode, route.params.policyID, tagName, orderWeight],
    );

    return (
        <AccessOrNotFoundWrapper
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={route.params.policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}
        >
            <ScreenWrapper
                includeSafeAreaPaddingBottom={false}
                style={[styles.defaultModalContainer]}
                testID={TagGLCodePage.displayName}
                shouldEnableMaxHeight
            >
                <HeaderWithBackButton
                    title={translate('workspace.tags.glCode')}
                    onBackButtonPress={() => Navigation.goBack()}
                />
                <FormProvider
                    formID={ONYXKEYS.FORMS.WORKSPACE_TAG_FORM}
                    onSubmit={editGLCode}
                    submitButtonText={translate('common.save')}
                    style={[styles.mh5, styles.flex1]}
                    enabledWhenOffline
                >
                    <InputWrapper
                        ref={inputCallbackRef}
                        InputComponent={TextInput}
                        defaultValue={glCode}
                        label={translate('workspace.tags.glCode')}
                        accessibilityLabel={translate('workspace.tags.glCode')}
                        inputID={INPUT_IDS.TAG_GL_CODE}
                        role={CONST.ROLE.PRESENTATION}
                        maxLength={CONST.MAX_LENGTH_256}
                    />
                </FormProvider>
            </ScreenWrapper>
        </AccessOrNotFoundWrapper>
    );
}

TagGLCodePage.displayName = 'TagGLCodePage';

export default withOnyx<EditCategoryPageProps, WorkspaceEditTagGLCodePageOnyxProps>({
    policyTags: {
        key: ({route}) => `${ONYXKEYS.COLLECTION.POLICY_TAGS}${route?.params?.policyID}`,
    },
})(TagGLCodePage);

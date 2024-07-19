export function parseMessage(message: string) {


    switch (message) {
        case 'Firebase: Error (auth/invalid-email).':
            return 'Email nije u validnom formatu'

        case 'Firebase: Error (auth/invalid-credential).':
            return 'Pogrešni kredencijali'

        case 'Firebase: Error (auth/email-already-in-use).':
            return 'Email je već registrovan'

        default:
            break;
    }

}
<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to user
ini_set('log_errors', 1);

require_once 'vendor/autoload.php'; // If using Composer
// Alternative: include PHPMailer files manually if not using Composer
// require_once 'PHPMailer/src/Exception.php';
// require_once 'PHPMailer/src/PHPMailer.php';
// require_once 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Set JSON header at the very beginning
header('Content-Type: application/json; charset=utf-8');

$config = [
    'smtp_host' => 'smtp.gmail.com', // Remplacez par votre serveur SMTP
    'smtp_port' => 587,
    'smtp_username' => 'hassaneahmat06@gmail.com', // Remplacez par votre email
    'smtp_password' => '', // Remplacez par votre mot de passe d'application
    'from_email' => 'noreply@agence-creative.fr',
    'from_name' => 'Agence Créative',
    'to_email' => 'hassaneahmat06@gmail.com', // Email de destination
    'to_name' => 'Agence Créative'
];

// Configuration
$destinataire = $config['to_email']; // Remplacez par votre adresse email
$sujet_prefix = "[Site Web] Nouveau message de contact";

// Headers pour l'email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . $config['from_email'] . "\r\n";

// Fonction de validation et nettoyage
function nettoyer_donnee($donnee) {
    $donnee = trim($donnee);
    $donnee = stripslashes($donnee);
    $donnee = htmlspecialchars($donnee);
    return $donnee;
}

// Fonction de validation email
function valider_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

try {
    // Initialisation des variables
    $erreurs = array();
    $succes = false;

    // Traitement du formulaire
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        // Récupération et nettoyage des données
        $nom = isset($_POST['nom']) ? nettoyer_donnee($_POST['nom']) : '';
        $email = isset($_POST['email']) ? nettoyer_donnee($_POST['email']) : '';
        $telephone = isset($_POST['telephone']) ? nettoyer_donnee($_POST['telephone']) : '';
        $entreprise = isset($_POST['entreprise']) ? nettoyer_donnee($_POST['entreprise']) : '';
        $service = isset($_POST['service']) ? nettoyer_donnee($_POST['service']) : '';
        $budget = isset($_POST['budget']) ? nettoyer_donnee($_POST['budget']) : '';
        $message = isset($_POST['message']) ? nettoyer_donnee($_POST['message']) : '';
        $rgpd = isset($_POST['rgpd']) ? true : false;
        
        // Validation des champs obligatoires
        if (empty($nom)) {
            $erreurs['nom'] = "Le nom est obligatoire.";
        } elseif (strlen($nom) < 2) {
            $erreurs['nom'] = "Le nom doit contenir au moins 2 caractères.";
        }
        
        if (empty($email)) {
            $erreurs['email'] = "L'adresse email est obligatoire.";
        } elseif (!valider_email($email)) {
            $erreurs['email'] = "L'adresse email n'est pas valide.";
        }
        
        if (empty($message)) {
            $erreurs['message'] = "Le message est obligatoire.";
        } elseif (strlen($message) < 10) {
            $erreurs['message'] = "Le message doit contenir au moins 10 caractères.";
        }
        
        if (!$rgpd) {
            $erreurs['rgpd'] = "Vous devez accepter l'utilisation de vos données.";
        }
        
        // Validation du téléphone si fourni
        if (!empty($telephone) && !preg_match('/^[0-9+\-\s()\.]{8,20}$/', $telephone)) {
            $erreurs['telephone'] = "Le format du téléphone n'est pas valide.";
        }
        
        // Si pas d'erreurs, envoi de l'email
        if (empty($erreurs)) {
            
            // Préparation du contenu de l'email
            $sujet = $sujet_prefix . " - " . $nom;
            
            $contenu_email = "
            <html>
            <head>
                <title>Nouveau message de contact</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #ff6b35; }
                    .value { margin-top: 5px; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>Nouveau Message de Contact</h2>
                    </div>
                    <div class='content'>
                        <div class='field'>
                            <div class='label'>Nom :</div>
                            <div class='value'>" . htmlspecialchars($nom) . "</div>
                        </div>
                        <div class='field'>
                            <div class='label'>Email :</div>
                            <div class='value'>" . htmlspecialchars($email) . "</div>
                        </div>";
            
            if (!empty($telephone)) {
                $contenu_email .= "
                        <div class='field'>
                            <div class='label'>Téléphone :</div>
                            <div class='value'>" . htmlspecialchars($telephone) . "</div>
                        </div>";
            }
            
            if (!empty($entreprise)) {
                $contenu_email .= "
                        <div class='field'>
                            <div class='label'>Entreprise :</div>
                            <div class='value'>" . htmlspecialchars($entreprise) . "</div>
                        </div>";
            }
            
            if (!empty($service)) {
                $contenu_email .= "
                        <div class='field'>
                            <div class='label'>Service souhaité :</div>
                            <div class='value'>" . htmlspecialchars($service) . "</div>
                        </div>";
            }
            
            if (!empty($budget)) {
                $contenu_email .= "
                        <div class='field'>
                            <div class='label'>Budget :</div>
                            <div class='value'>" . htmlspecialchars($budget) . "</div>
                        </div>";
            }
            
            $contenu_email .= "
                        <div class='field'>
                            <div class='label'>Message :</div>
                            <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                        </div>
                    </div>
                    <div class='footer'>
                        <p>Ce message a été envoyé depuis le formulaire de contact du site web.</p>
                        <p>Date : " . date('d/m/Y à H:i:s') . "</p>
                    </div>
                </div>
            </body>
            </html>";
            
            try {
                // Création d'une instance PHPMailer
                $mail = new PHPMailer(true);
                
                // Configuration du serveur SMTP
                $mail->isSMTP();
                $mail->Host = $config['smtp_host'];
                $mail->SMTPAuth = true;
                $mail->Username = $config['smtp_username'];
                $mail->Password = $config['smtp_password'];
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = $config['smtp_port'];
                $mail->CharSet = 'UTF-8';
                
                // Configuration de l'expéditeur et du destinataire
                $mail->setFrom($config['from_email'], $config['from_name']);
                $mail->addAddress($config['to_email'], $config['to_name']);
                $mail->addReplyTo($email, $nom);
                
                // Configuration du contenu
                $mail->isHTML(true);
                $mail->Subject = $sujet_prefix . " - " . $nom;
                $mail->Body = $contenu_email;
                
                $mail->send();
                $succes = true;
                
                // Send confirmation email
                try {
                    $confirmation_mail = new PHPMailer(true);
                    $confirmation_mail->isSMTP();
                    $confirmation_mail->Host = $config['smtp_host'];
                    $confirmation_mail->SMTPAuth = true;
                    $confirmation_mail->Username = $config['smtp_username'];
                    $confirmation_mail->Password = $config['smtp_password'];
                    $confirmation_mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $confirmation_mail->Port = $config['smtp_port'];
                    $confirmation_mail->CharSet = 'UTF-8';
                    
                    $confirmation_mail->setFrom($config['from_email'], $config['from_name']);
                    $confirmation_mail->addAddress($email, $nom);
                    
                    $confirmation_mail->isHTML(true);
                    $confirmation_mail->Subject = "Confirmation de réception - Agence Créative";
                    $confirmation_mail->Body = "
                    <html>
                    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                        <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                            <div style='background-color: #ff6b35; color: white; padding: 20px; text-align: center;'>
                                <h2>Merci pour votre message !</h2>
                            </div>
                            <div style='padding: 20px; background-color: #f9f9f9;'>
                                <p>Bonjour " . htmlspecialchars($nom) . ",</p>
                                <p>Nous avons bien reçu votre message et nous vous remercions de votre intérêt pour nos services.</p>
                                <p>Notre équipe reviendra vers vous dans les plus brefs délais.</p>
                                <p>Cordialement,<br>L'équipe Agence Créative</p>
                            </div>
                        </div>
                    </body>
                    </html>";
                    
                    $confirmation_mail->send();
                } catch (Exception $confirmation_e) {
                    // Log confirmation email error but don't fail the main process
                    error_log("Confirmation email error: " . $confirmation_e->getMessage());
                }
                
            } catch (Exception $e) {
                error_log("PHPMailer Error: " . $e->getMessage());
                $erreurs['general'] = "Erreur lors de l'envoi du message. Veuillez réessayer.";
                $succes = false;
            }
        }
        
        if ($succes) {
            echo json_encode([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'errors' => $erreurs
            ]);
        }
        exit;
    }
    
    echo json_encode([
        'success' => false,
        'errors' => ['general' => 'Méthode non autorisée.']
    ]);
    
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'errors' => ['general' => 'Une erreur technique est survenue. Veuillez réessayer plus tard.']
    ]);
}
?>

package tn.examen.templateexamen2324.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.activation.DataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Response;
import org.apache.commons.validator.routines.EmailValidator;
import org.apache.james.mime4j.dom.Multipart;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import tn.examen.templateexamen2324.entity.*;
import tn.examen.templateexamen2324.repository.IndividuRepository;
import tn.examen.templateexamen2324.repository.SocietyRepository;
import tn.examen.templateexamen2324.repository.UserRepository;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.oauth2.jwt.Jwt;

import javax.imageio.ImageIO;

@Service
public class AuthService implements IAuthService{

    private static final String UPDATE_PASSWORD = "UPDATE_PASSWORD";
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    RestTemplate restTemplate;
    @Autowired
    UserRepository userRepository;
    @Autowired
    IndividuRepository individuRepository;
    @Autowired
    SocietyRepository societyRepository;
    @Autowired
    HttpServletRequest request;
    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String iuuserUrl;
    @Value("${spring.security.oauth2.client.registration.oauth2-client-credentials.client-id}")
    private String clientId;
    @Value("${spring.security.oauth2.client.registration.oauth2-client-credentials.authorization-grant-type}")
    private String grantType;
    @Value("${keycloak.auth-server-url}")
    private String server_url;
    @Value("${keycloak.realm}")
    private String realm;
    @Value("${keycloak.credentials.secret}")
    private String secret;
    @Value("${spring.security.oauth2.client.registration.oauth2-client-credentials.client-secret}")
    private String clientSecret;
    private Keycloak keycloak;
    private static final String uploadPath = "C:/Users/MSI/piForumProject/backend/pi-backend/Templateexamen23-24/src/main/resources/fils";

    public AuthService(Keycloak keycloak) {
        this.keycloak = keycloak;
    }


    @Override
    public ResponseEntity<?> login(String username, String password) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", clientId);
        requestBody.add("grant_type", grantType);
        //requestBody.add("client_secret", secret);
        requestBody.add("username", username);
        requestBody.add("password", password);
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<LoginResponse> response = restTemplate.postForEntity("http://localhost:8082/realms/esprit-piazza/protocol/openid-connect/token", httpEntity, LoginResponse.class);
            return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
        } catch (HttpClientErrorException ex) {
            ResponseMessage message = new ResponseMessage();
            if (ex.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                message.setMessage("There is no account with the provided credentials");
                return new ResponseEntity<>(message, ex.getStatusCode());
            } else {
                message.setMessage(ex.getResponseBodyAsString());
                return new ResponseEntity<>(message, ex.getStatusCode());
            }
        }
    }

    @Override
    public ResponseEntity<ResponseMessage> logout(String token) {
        ResponseMessage message = new ResponseMessage();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("client_id", clientId);
            map.add("client_secret", secret);
            map.add("refresh_token", token);
            HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(map, headers);
            restTemplate.postForEntity("http://localhost:8082/realms/esprit-piazza/protocol/openid-connect/logout", httpEntity, ResponseMessage.class);
            message.setMessage("Logged out successfully");
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (HttpClientErrorException ex) {
            message.setMessage(ex.getResponseBodyAsString());
            return new ResponseEntity<>(message, ex.getStatusCode());
        }
    }

    @Override
    public Object[] createUser(Map<String, String> userRegistration){
        boolean isIndividuRole = false;
        for (IndividuRole role : IndividuRole.values()) {
            if (role.toString().equals(userRegistration.get("role"))) {
                isIndividuRole = true;
                break;
            }
        }
        if(isIndividuRole){
            Individu userIndividu = new Individu(userRegistration);
            return createIndividu(userIndividu);
        }else{
            Society userSociety = new Society(userRegistration);
            return createSociety(userSociety);
        }
    }


    public Object[] createIndividu(Individu userRegistration) {
        ResponseMessage message = new ResponseMessage();
        int statusId = 0;
        try {
            UserRepresentation user = new UserRepresentation();
            user.setEnabled(true);
            user.setEmailVerified(false);
            CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
            credentialRepresentation.setTemporary(false);
            credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
            List<CredentialRepresentation> list = new ArrayList<>();
            user.setUsername(userRegistration.getUsername());
            user.setEmail(userRegistration.getEmail());
            user.setFirstName(userRegistration.getFirstName());
            user.setLastName(userRegistration.getLastName());
            credentialRepresentation.setValue(userRegistration.getPassword());

            list.add(credentialRepresentation);
            user.setCredentials(list);
            UsersResource usersResource = getUsersResource();
            Response response = usersResource.create(user);
            statusId = response.getStatus();
            if (Objects.equals(201, response.getStatus())) {
                URI location = response.getLocation();
                if (location != null) {
                    String userId = location.getPath().substring(location.getPath().lastIndexOf('/') + 1);
                    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                    String hashedPassword = passwordEncoder.encode(userRegistration.getPassword());
                    User userData = userRegistration;
                    userData.setId(userId);
                    userData.setPassword(hashedPassword);
                    userData.setActivate(true);
                    userData.setApprove(false);
                    userData.setImage("user.png");
                    userRepository.save(userData);

                    //emailVerification(userId);
                    assignRole(userId,userRegistration.getRole().toString());
                    message.setMessage("Account created successfully");
                }
            } else if (statusId == 409) {
                message.setMessage("the username or email already exists");
            } else {
                message.setMessage("there was an error while creating this account");
            }

            return new Object[]{statusId, message};
        } catch (Exception e) {
            message.setMessage("Error occurred while creating the account: " + e.getMessage());
            return new Object[]{HttpStatus.INTERNAL_SERVER_ERROR.value(), message};
        }
    }

    public Object[] createSociety(Society userRegistration) {
        ResponseMessage message = new ResponseMessage();
        int statusId = 0;
        try {
            UserRepresentation user = new UserRepresentation();
            user.setEnabled(true);
            user.setEmailVerified(false);
            CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
            credentialRepresentation.setTemporary(false);
            credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
            List<CredentialRepresentation> list = new ArrayList<>();
            user.setUsername(userRegistration.getUsername());
            user.setEmail(userRegistration.getEmail());
            credentialRepresentation.setValue(userRegistration.getPassword());

            list.add(credentialRepresentation);
            user.setCredentials(list);
            UsersResource usersResource = getUsersResource();
            Response response = usersResource.create(user);
            statusId = response.getStatus();
            if (Objects.equals(201, response.getStatus())) {
                URI location = response.getLocation();
                if (location != null) {
                    String userId = location.getPath().substring(location.getPath().lastIndexOf('/') + 1);
                    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                    String hashedPassword = passwordEncoder.encode(userRegistration.getPassword());
                    User userData = userRegistration;
                    userData.setId(userId);
                    userData.setPassword(hashedPassword);
                    userData.setActivate(true);
                    userData.setApprove(false);
                    userData.setImage("user.png");
                    userRepository.save(userData);

                    //emailVerification(userId);
                    assignRole(userId,userRegistration.getRole().toString());
                    message.setMessage("Account created successfully");
                }
            } else if (statusId == 409) {
                message.setMessage("this account already exists");
            } else {
                message.setMessage("there was an error while creating this account");
            }
            return new Object[]{statusId, message};
        } catch (Exception e) {
            message.setMessage("Error occurred while creating the account: " + e.getMessage());
            return new Object[]{HttpStatus.INTERNAL_SERVER_ERROR.value(), message};
        }
    }


    @Override
    public void emailVerification(String userId){
        UsersResource usersResource = getUsersResource();
        usersResource.get(userId).sendVerifyEmail();
    }

    private UsersResource getUsersResource() {
        RealmResource realm1 = keycloak.realm(realm);
        return realm1.users();
    }
    public UserResource getUserResource(String userId){
        UsersResource usersResource = getUsersResource();
        return usersResource.get(userId);
    }

    @Override
    public User getUserById(String userId) {
        return  userRepository.findById(userId).orElse(null);
    }

    @Override
    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public ResponseEntity<String> deleteUserById(String userId) {
        try {
            Response response = getUsersResource().delete(userId);
            int statusCode = response.getStatus();
            switch (statusCode) {
                case 204:
                    userRepository.deleteById(userId);
                    return ResponseEntity.ok("User deleted successfully");
                case 401:
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
                case 403:
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
                default:
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public void assignRole(String userId, String roleName) {
        UserResource userResource = getUserResource(userId);
        RolesResource rolesResource = getRolesResource();
        RoleRepresentation representation = rolesResource.get(roleName).toRepresentation();
        System.out.println(representation);
        userResource.roles().realmLevel().add(Collections.singletonList(representation));
    }

    private RolesResource getRolesResource(){
        return  keycloak.realm(realm).roles();
    }

    @Override
    public Object[] updateUser(String id,Map<String, String> userRegistration) {
        boolean isIndividuRole = false;
        for (IndividuRole role : IndividuRole.values()) {
            if (role.toString().equals(userRegistration.get("role"))) {
                isIndividuRole = true;
                break;
            }
        }
        if (isIndividuRole) {
            Individu userIndividu = new Individu(userRegistration);
            return updateIndividu(id,userIndividu);
        } else {
            Society userSociety = new Society(userRegistration);
            return updateSociety(id,userSociety);
        }
    }

    public Object[] updateIndividu(String id,Individu individu) {
        ResponseMessage message = new ResponseMessage();
        int statusId = 200;
        try{
            UsersResource usersResource = getUsersResource();
            UserResource userResource = usersResource.get(id);
            UserRepresentation updatedUser = new UserRepresentation();
            updatedUser.setFirstName(individu.getFirstName());
            updatedUser.setLastName(individu.getLastName());
            userResource.update(updatedUser);
            Individu individu1 = individuRepository.findById(id).orElse(null);
            assert individu1 != null;
            individu1.setFirstName(individu.getFirstName());
            individu1.setLastName(individu.getLastName());
            individu1.setPortfolio(individu.getPortfolio());
            individu1.setLinkedin(individu.getLinkedin());

            individu1.setDescription(individu.getDescription());
            userRepository.save(individu1);
            return new Object[]{statusId, individu1};
        } catch (Exception e) {
            message.setMessage("Error occurred while updating your account: " + e.getMessage());
            return new Object[]{HttpStatus.INTERNAL_SERVER_ERROR.value(), message};
        }
    }

    public Object[] updateSociety(String id,Society society) {
        ResponseMessage message = new ResponseMessage();
        int statusId = 200;
        try{
            Society society1 = this.societyRepository.findById(id).orElse(null);
            society1.setSector(society.getSector());
            society1.setMatricule(society.getMatricule());
            society1.setAdresse(society.getAdresse());
            society1.setRepresentative(society.getRepresentative());
            userRepository.save(society1);
            //message.setMessage("Profile updated successfully");
            return new Object[]{statusId, society1};
        } catch (Exception e) {
            message.setMessage("Error occurred while updating your account: " + e.getMessage());
            return new Object[]{HttpStatus.INTERNAL_SERVER_ERROR.value(), message};
        }
    }

    @Override
    public ResponseEntity<?> checkUser(Jwt jwtToken){
        ResponseMessage message = new ResponseMessage();
        Map<String, Object> claims = jwtToken.getClaims();
        boolean email = jwtToken.getClaim("email_verified");
        String userId = jwtToken.getClaim("sub");
        User user = userRepository.findById(userId).orElse(null);
        if(email){
            if(!user.isApprove()){
                message.setMessage("Not approved");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
            }else if (!user.isActivate()){
                message.setMessage("This account is inactive for some reasons.Contact the administration");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
            }
        }else{
            message.setMessage("Not verified");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        }
        return ResponseEntity.ok(claims);
    }

    @Override
    public ResponseEntity<?> approveUser(String userId){
        ResponseMessage message = new ResponseMessage();
        try {
            User user = userRepository.findById(userId).orElse(null);
            user.setApprove(true);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            message.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        }
    }

    @Override
    public ResponseEntity<?> activateUser(String userId){
        ResponseMessage message = new ResponseMessage();
        try {
            User user = userRepository.findById(userId).orElse(null);
            user.setActivate(!user.isActivate());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            message.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        }
    }

    @Override
    public List<Individu> getAllIndividu() {
        List<IndividuRole> excludedRoles = Arrays.asList(IndividuRole.Community, IndividuRole.FinancialDirection, IndividuRole.Admin);
        List<Individu> individus = individuRepository.getAllIndividuExcepte(excludedRoles);
        return individus;
    }

    @Override
    public List<Society> getAllSociety() {return societyRepository.findAll();}

    @Override
    public List<Individu> getAllIndividuFilteredByRole(IndividuRole role){return individuRepository.findAllByRole(role);}

    @Override
    public List<Individu> getAllIndividuFilteredByFields(String field){return individuRepository.findAllByFields(field);}

    @Override
    public List<Society> getAllSocietiesFilteredByRole(SocietyRole role){return societyRepository.findAllByRole(role);}

    @Override
    public List<Society> getAllSocietiesFilteredByFields(String field){return societyRepository.findAllByFields(field);}

    @Override
    public ResponseEntity<ResponseMessage> forgotPassword(String username){
        ResponseMessage message = new ResponseMessage();
        try {
            UsersResource usersResource = getUsersResource();
            boolean isValid = EmailValidator.getInstance().isValid(username);
            if (isValid) {
                List<UserRepresentation> users = usersResource.searchByEmail(username,true);
                UserRepresentation userRepresentation = users.stream().findFirst().orElse(null);
                if (userRepresentation!=null) {
                    return sendPasswordResetEmail(userRepresentation,usersResource);
                }
            } else {
                List<UserRepresentation> usersByEmail = usersResource.searchByUsername(username,true);
                UserRepresentation usersByEmailRepresentation = usersByEmail.stream().findFirst().orElse(null);
                if (usersByEmailRepresentation!=null) {
                    return sendPasswordResetEmail(usersByEmailRepresentation,usersResource);
                }
            }
            message.setMessage("No account was found with the provided credentials");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        } catch (Exception e) {
            message.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        }
    }

    private ResponseEntity<ResponseMessage> sendPasswordResetEmail(UserRepresentation userRepresentation,UsersResource usersResource) {
        ResponseMessage message = new ResponseMessage();
        UserResource userResource = usersResource.get(userRepresentation.getId());
        List<String> actions = new ArrayList<>();
        actions.add(UPDATE_PASSWORD);
        userResource.executeActionsEmail(actions);
        message.setMessage("An email has been sent. Check your inbox.");
        return ResponseEntity.ok(message);
    }

    @Override
    public ResponseEntity<?> updatePassword(String oldPassword,String newPassword,String username){
        ResponseMessage message = new ResponseMessage();
        try {
            UsersResource usersResource = getUsersResource();
            List<UserRepresentation> users = usersResource.searchByUsername(username,true);
            UserRepresentation userRepresentation = users.stream().findFirst().orElse(null);
            User user = userRepository.findById(userRepresentation.getId()).orElse(null);
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (userRepresentation != null && user != null) {
                if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("The older password is incorrect");
                }
                CredentialRepresentation newCredential = new CredentialRepresentation();
                newCredential.setType(CredentialRepresentation.PASSWORD);
                newCredential.setValue(newPassword);
                newCredential.setTemporary(false);
                usersResource.get(userRepresentation.getId()).resetPassword(newCredential);
                String hashedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(hashedPassword);
                userRepository.save(user);
                return ResponseEntity.ok(user);
            }else{
                message.setMessage("User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            message.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        }
    }

    @Override
    public ResponseEntity<?> refreshToken(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "refresh_token");
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", secret);
        requestBody.add("refresh_token", token);
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<LoginResponse> response = restTemplate.postForEntity("http://localhost:8082/realms/esprit-piazza/protocol/openid-connect/token", httpEntity, LoginResponse.class);
            return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
        } catch (HttpClientErrorException ex) {
            ResponseMessage message = new ResponseMessage();
            if (ex.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                message.setMessage("There is no account with the provided credentials");
                return new ResponseEntity<>(message, ex.getStatusCode());
            } else {
                message.setMessage(ex.getResponseBodyAsString());
                return new ResponseEntity<>( message, ex.getStatusCode());
            }
        }
    }

    @Override
    public ResponseEntity<?> addImageToUser(String userId, MultipartFile image) {
        ResponseMessage message = new ResponseMessage();
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (image != null) {
                String newPhotoName = nameFile(image);
                String oldPhotoName = user.getImage();
                System.out.println(oldPhotoName);
                user.setImage(newPhotoName);
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdir();
                }
                if(!oldPhotoName.equals("user.png")){
                    deleteFile(oldPhotoName);
                }
                saveFile(image,newPhotoName);
                return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
            }else {
                message.setMessage("There is no image");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
            }
        } catch (IOException e) {
            message.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
        }
    }

    public void saveFile(MultipartFile multipartFile,String fileName) throws IOException{
        Path upload = Paths.get(uploadPath);
        if(!Files.exists(upload)){
            Files.createDirectories(upload);
        }
        try (InputStream inputStream = multipartFile.getInputStream()){
            Path filePath = upload.resolve(fileName);
            Files.copy(inputStream,filePath, StandardCopyOption.REPLACE_EXISTING);
        }catch (IOException e){
            throw new IOException("Could not save file");
        }
    }

    public String nameFile(MultipartFile multipartFile){
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
        Integer fileDotIndex = originalFileName.lastIndexOf('.');
        String fileExtension = originalFileName.substring(fileDotIndex);
        return UUID.randomUUID().toString() + fileExtension;
    }

    public void deleteFile(String fileName) throws IOException{
        Path upload = Paths.get(uploadPath);
        Path filePath = upload.resolve(fileName);
        Files.deleteIfExists(filePath);
        System.out.println(fileName);
        System.out.println("deleted");
    }

    @Override
    public ResponseEntity<Resource> getUserImage(String userId)  throws IOException {
        User user = userRepository.findById(userId).orElse(null);
        Path imagePath = Paths.get(uploadPath,"/"+ user.getImage());
        if (Files.exists(imagePath) && Files.isReadable(imagePath)) {
            byte[] imageBytes = Files.readAllBytes(imagePath);
            ByteArrayResource resource = new ByteArrayResource(imageBytes);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            String fileExtension = Files.probeContentType(imagePath);
            if (fileExtension != null) {
                headers.setContentType(MediaType.parseMediaType(fileExtension));
            }
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + userId + fileExtension);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Override
    public Map<String, Long> listOfUsersByType() {
        Map<String, Long> combinedCountByRole = new HashMap<>();

        convertListToObjectMapIndividu(individuRepository.getIndividuCountByRole())
                .forEach((role, count) -> combinedCountByRole.merge(role, count, Long::sum));

        convertListToObjectMapSociety(societyRepository.getSocietyCountByRole())
                .forEach((role, count) -> combinedCountByRole.merge(role, count, Long::sum));

        return combinedCountByRole;
    }

    private Map<String, Long> convertListToObjectMapIndividu(List<Object[]> counts) {
        return counts.stream()
                .collect(Collectors.toMap(
                        count -> ((IndividuRole) count[0]).toString(),
                        count -> (Long) count[1],
                        Long::sum));
    }

    private Map<String, Long> convertListToObjectMapSociety(List<Object[]> counts) {
        return counts.stream()
                .collect(Collectors.toMap(
                        count -> ((SocietyRole) count[0]).toString(),
                        count -> (Long) count[1],
                        Long::sum));
    }

    public byte[] generateQrCodeImage(String content) throws IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hintMap = new HashMap<>();
        hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        BitMatrix bitMatrix;
        try {
            bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 200, 200, hintMap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate qr code image", e);
        }
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        BufferedImage qrImage = toBufferedImage(bitMatrix);
        try {
            ImageIO.write(qrImage, "png", outputStream);
        } catch (IOException e) {
            throw new RuntimeException("Failed to write qr code image", e);
        }
        return outputStream.toByteArray();
    }

    private BufferedImage toBufferedImage(BitMatrix matrix) {
        int width = matrix.getWidth();
        int height = matrix.getHeight();
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = (Graphics2D) image.getGraphics();
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, width, height);
        graphics.setColor(Color.BLACK);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                if (matrix.get(x, y)) {
                    graphics.fillRect(x, y, 1, 1);
                }
            }
        }
        return image;
    }

    @Override
    public void sendEmailToUser(String userId) {
        Individu user = individuRepository.findById(userId).orElse(null);
        System.out.println(user);
        String email = user.getEmail();
        String content = "Nom et prénom: "+user.getFirstName()+" "+user.getLastName()+" - Identifiant: "+user.getIdentity();
        try {
            byte[] qrCodeImageBytes = generateQrCodeImage(content);
            ByteArrayResource byteArrayResource = new ByteArrayResource(qrCodeImageBytes);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("walahamdi0@gmail.com");
            helper.setTo(email);
            helper.setSubject("Votre code QR pour les opportunités futures");
            helper.setText("Cher étudiant, Nous vous avons envoyé un code QR que vous pourrez utiliser à l'avenir pour des stages, des opportunités d'emploi et d'autres perspectives passionnantes. Veuillez trouver le code QR joint. Cordialement, L'équipe de Esprit piazza");
            helper.addAttachment("qr_code.png", byteArrayResource, "image/png");
            mailSender.send(message);

        } catch (MessagingException | IOException e) {
            e.printStackTrace();
        }
    }

}

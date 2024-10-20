package tn.examen.templateexamen2324.services;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.multipart.MultipartFile;
import tn.examen.templateexamen2324.entity.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IAuthService {
    public ResponseEntity<?> login(String username, String password);
    public ResponseEntity<ResponseMessage> logout(String token);
    public Object[] createUser(Map<String, String> userRegistration);
    public void emailVerification(String userId);
    public User getUserById(String userId);
    public ResponseEntity<String> deleteUserById(String userId);
    public List<User> getAllUsers();
    public Object[] updateUser(String id,Map<String, String> userRegistration);
    public ResponseEntity<?> checkUser(Jwt jwtToken);
    public ResponseEntity<?> approveUser(String userId);
    public ResponseEntity<?> activateUser(String userId);
    public List<Individu> getAllIndividu();
    public List<Society> getAllSociety();
    public List<Individu> getAllIndividuFilteredByRole(IndividuRole role);
    public List<Individu> getAllIndividuFilteredByFields(String fields);
    public List<Society> getAllSocietiesFilteredByRole(SocietyRole role);
    public List<Society> getAllSocietiesFilteredByFields(String field);
    public ResponseEntity<ResponseMessage> forgotPassword(String username);
    public ResponseEntity<?> updatePassword(String oldPassword,String newPassword,String username);
    public ResponseEntity<?> refreshToken(String token);
    public ResponseEntity<?> addImageToUser(String userId, MultipartFile image);
    public ResponseEntity<Resource> getUserImage(String userId)  throws IOException;
    public Map<String, Long> listOfUsersByType();
    public void sendEmailToUser(String id);
}
